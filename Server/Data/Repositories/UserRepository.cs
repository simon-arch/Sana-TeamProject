using System.Data;
using System.Text.Json;
using Dapper;
using Microsoft.Data.SqlClient;
using Server.Authorization;
using Server.Models;

namespace Server.Data.Repositories
{
    public class UserRepository(DbProvider provider) : IUserRepository
    {
        private readonly SqlConnection _sql = provider.Connection;

        private Task<int> _CountAsync(string condition) =>
            _sql.QuerySingleAsync<int>($"SELECT COUNT(*) FROM Users {condition}");

        public Task<User?> GetAsync(string username) => _GetAsync($"Username = '{username}'");

        public Task<User?> GetAsync(Guid tokenId) => _GetAsync($"TokenId = '{tokenId}'");

        private async Task<User?> _GetAsync(string condition)
        {
            string query = $@"
                    SELECT u.Username, u.PasswordHash, u.TokenId, u.FirstName, u.LastName, u.Role, u.Permissions, u.State, u.WorkType, u.WorkTime,
                           va.UserUsername, va.ApprovedVacationsByUsers
                    FROM Users u
                    LEFT JOIN VacationApprovers va ON u.Username = va.UserUsername
                    WHERE {condition}";

            var result = await _sql.QueryAsync<User, VacationApprovers, User>(
                query,
                (user, vacationApprovers) =>
                {
                    user.VacationApprovers = vacationApprovers ?? null;

                    return user;
                },
                splitOn: "UserUsername");

            return result.FirstOrDefault();
        }

        public Task<ResultSet<User>> GetAllAsync() => GetAllAsync(new GetAllOptions());

        public async Task<ResultSet<User>> GetAllAsync(GetAllOptions options)
        {
            string sql = @$"
        SELECT 
            u.Username, u.PasswordHash, u.TokenId, u.FirstName, u.LastName, u.Role, 
            u.Permissions, u.State, u.WorkType, u.WorkTime,
            va.UserUsername, va.ApprovedVacationsByUsers
        FROM Users u
        LEFT JOIN VacationApprovers va ON u.Username = va.UserUsername
        {options.Condition}
        {options.OrderBy}
        {options.Pagination}";
            
            var result = await _sql.QueryAsync<User, VacationApprovers, User>(
                sql,
                (user, vacationApprovers) =>
                {
                    user.VacationApprovers = vacationApprovers ?? new VacationApprovers
                    {
                        UserUsername = user.Username,
                        ApprovedVacationsByUsers = new List<string>()
                    };
                    
                    if (vacationApprovers?.ApprovedVacationsByUsers != null)
                    {
                        user.VacationApprovers.ApprovedVacationsByUsers =
                            vacationApprovers.ApprovedVacationsByUsers.ToList();
                    }

                    return user;
                },
                splitOn: "UserUsername"
            );
            
            return new ResultSet<User>
            {
                TotalCount = await _CountAsync(options.Condition),
                Results = result.ToList()
            };
        }
        
        // TODO: Refactor this method to use a stored procedure
        public async Task<IEnumerable<User>> GetUsersWithPermissionsAsync(Permission[] permissions)
        {
            var permissionParams = string.Join(",", permissions.Select(p => (int)p));

            var query = $@"
            DECLARE @Permissions TABLE (Permission INT);
            INSERT INTO @Permissions (Permission) VALUES ({permissionParams});

            SELECT Username, FirstName, LastName, Role, State
            FROM Users
            WHERE EXISTS (
                SELECT 1
                FROM OPENJSON(Permissions) WITH (Permission INT '$') AS p
                WHERE p.Permission IN (SELECT Permission FROM @Permissions)
            )";

            return await _sql.QueryAsync<User>(query);
        }

        public async Task InsertAsync(User user)
        {
            if (_sql.State != ConnectionState.Open)
            {
                await _sql.OpenAsync();
            }

            await using var transaction = _sql.BeginTransaction();
            try
            {
                string userQuery = @"
                        INSERT INTO Users 
                        (Username, PasswordHash, TokenId, FirstName, LastName, Role, Permissions, State, WorkType, WorkTime)
                        VALUES 
                        (@Username, @PasswordHash, @TokenId, @FirstName, @LastName, @Role, @Permissions, @State, @WorkType, @WorkTime)
                        ";

                await _sql.ExecuteAsync(userQuery, user, transaction);

                if (user.VacationApprovers != null)
                {
                    string vacationApproversQuery = @"
                        INSERT INTO VacationApprovers 
                        (UserUsername, ApprovedVacationsByUsers)
                        VALUES 
                        (@UserUsername, @ApprovedVacationsByUsers)
                        ";

                    var approvedVacationsJson =
                        JsonSerializer.Serialize(user.VacationApprovers.ApprovedVacationsByUsers);

                    await _sql.ExecuteAsync(vacationApproversQuery, new
                    {
                        UserUsername = user.Username,
                        ApprovedVacationsByUsers = approvedVacationsJson
                    }, transaction);
                }

                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
        
        public async Task UpdateAsync(User user)
        {
            if (_sql.State != ConnectionState.Open)
            {
                await _sql.OpenAsync();
            }

            await using var transaction = _sql.BeginTransaction();
            try
            {
                string userQuery = $@"
                        UPDATE Users
                        SET PasswordHash = @PasswordHash, TokenId = @TokenId, FirstName = @FirstName, LastName = @LastName, 
                            Role = @Role, Permissions = @Permissions, State = @State, WorkType = @WorkType, WorkTime = @WorkTime
                        WHERE Username = @Username";

                await _sql.ExecuteAsync(userQuery, user, transaction);

                if (user.VacationApprovers != null)
                {
                    string vacationApproversQuery = @"
                            MERGE INTO VacationApprovers AS target
                            USING (SELECT @UserUsername AS UserUsername) AS source
                            ON (target.UserUsername = source.UserUsername)
                            WHEN MATCHED THEN
                                UPDATE SET 
                                    ApprovedVacationsByUsers = @ApprovedVacationsByUsers
                            WHEN NOT MATCHED THEN
                                INSERT (UserUsername, ApprovedVacationsByUsers)
                                VALUES (@UserUsername, @ApprovedVacationsByUsers);
                            ";

                    var approvedVacationsJson =
                        JsonSerializer.Serialize(user.VacationApprovers.ApprovedVacationsByUsers);

                    await _sql.ExecuteAsync(vacationApproversQuery, new
                    {
                        UserUsername = user.Username,
                        ApprovedVacationsByUsers = approvedVacationsJson
                    }, transaction);
                }

                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
        
        public async Task UpdateTokenAsync(string username, string tokenId)
        {
            if (_sql.State != ConnectionState.Open)
            {
                await _sql.OpenAsync();
            }

            string query = @"
                UPDATE Users
                SET TokenId = @TokenId
                WHERE Username = @Username";

            await _sql.ExecuteAsync(query, new { Username = username, TokenId = tokenId });
        }
        
        public async Task DeleteAsync(string username)
        {
            if (_sql.State != ConnectionState.Open)
            {
                await _sql.OpenAsync();
            }

            await using var transaction = _sql.BeginTransaction();
            try
            {
                var rowsAffected = await _sql.ExecuteAsync(
                    "DELETE FROM VacationApprovers WHERE UserUsername = @Username", new { Username = username },
                    transaction);
                if (rowsAffected == 0)
                {
                    throw new Exception("No rows affected in VacationApprovers");
                }

                rowsAffected = await _sql.ExecuteAsync("DELETE FROM Users WHERE Username = @Username",
                    new { Username = username }, transaction);
                if (rowsAffected == 0)
                {
                    throw new Exception("No rows affected in Users");
                }

                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw new Exception("Error during user deletion", ex);
            }
        }
    }

    public enum Sort
    {
        FullName,
        Role,
        State
    }

    public class GetAllOptions
    {
        public string Pagination { get; set; } = string.Empty;
        public string OrderBy { get; set; } = "(SELECT NULL)";
        public string Condition { get; set; } = string.Empty;
    }

    public class GetAllOptionsBuilder
    {
        private readonly GetAllOptions _options = new();
        private readonly List<string> _conditions = [];

        public GetAllOptionsBuilder SetPagination(int pageNumber, int pageSize)
        {
            ArgumentOutOfRangeException.ThrowIfNegativeOrZero(pageNumber);
            ArgumentOutOfRangeException.ThrowIfNegative(pageSize);

            _options.Pagination = $"OFFSET {(pageNumber - 1) * pageSize} ROWS FETCH NEXT {pageSize} ROWS ONLY";

            return this;
        }

        public GetAllOptionsBuilder SortBy(Sort sort)
        {
            switch (sort)
            {
                case Sort.FullName:
                    _options.OrderBy = "CONCAT(FirstName, ' ', LastName)";
                    break;

                case Sort.Role:
                    _options.OrderBy = "Role";
                    break;

                case Sort.State:
                    _options.OrderBy = "State";
                    break;
            }

            return this;
        }

        public GetAllOptionsBuilder SetQuery(string query)
        {
            if (!string.IsNullOrEmpty(query))
            {
                _conditions.Add($"CONCAT(FirstName, ' ', LastName) LIKE '%{query}%'");
            }

            return this;
        }

        public GetAllOptionsBuilder IncludeFired(bool includeFired)
        {
            if (!includeFired)
            {
                _conditions.Add($"State != {(int)State.Fired}");
            }

            return this;
        }

        public GetAllOptions Build()
        {
            if (_conditions.Count > 0)
                _options.Condition = "WHERE " + string.Join(" AND ", _conditions);

            _options.OrderBy = $"ORDER BY {_options.OrderBy}";

            return _options;
        }
    }
}