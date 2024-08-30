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

        private Task<User?> _GetAsync(string condition)
        {
            string query = $@"
                SELECT Username, PasswordHash, TokenId, FirstName, LastName, Role, Permissions, State, WorkType, WorkTime, 
                    ApprovedVacationsByUsers, ApproveVacationsForUsers
                FROM Users
                WHERE {condition}";

            return _sql.QueryFirstOrDefaultAsync<User>(query);
        }

        public Task<ResultSet<User>> GetAllAsync() => GetAllAsync(new GetAllOptions());

        public async Task<ResultSet<User>> GetAllAsync(GetAllOptions options)
        {
            string sql = @$"
                SELECT Username, PasswordHash, TokenId, FirstName, LastName, Role, Permissions, State, WorkType, WorkTime, 
                    ApprovedVacationsByUsers, ApproveVacationsForUsers 
                FROM Users
                {options.Condition}
                {options.OrderBy}
                {options.Pagination}";

            return new ResultSet<User>
            {
                TotalCount = await _CountAsync(options.Condition),
                Results = await _sql.QueryAsync<User>(sql)
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
        
        public Task InsertAsync(User user)
        {
            string query = @"
                INSERT INTO Users 
                (
                    Username, PasswordHash, TokenId, FirstName, LastName, Role, Permissions, State, 
                    WorkType, WorkTime, ApprovedVacationsByUsers, ApproveVacationsForUsers
                )
                VALUES 
                (
                    @Username, @PasswordHash, @TokenId, @FirstName, @LastName, @Role, @Permissions, @State, 
                    @WorkType, @WorkTime, @ApprovedVacationsByUsers, @ApproveVacationsForUsers
                )
            ";

            return _sql.ExecuteAsync(query, user);
        }

        public Task UpdateAsync(User user)
        {
            string query = $@"
                UPDATE Users
                SET PasswordHash = @PasswordHash, TokenId = @TokenId, FirstName = @FirstName,LastName = @LastName, 
                    Role = @Role, Permissions = @Permissions, State = @State, WorkType = @WorkType, WorkTime = @WorkTime, 
                    ApprovedVacationsByUsers = @ApprovedVacationsByUsers, ApproveVacationsForUsers = @ApproveVacationsForUsers
                WHERE Username = @Username";

            return _sql.ExecuteAsync(query, user);
        }

        public Task DeleteAsync(string username) =>
            _sql.ExecuteAsync($"DELETE FROM Users WHERE Username = '{username}'");
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
        public string OrderBy {  get; set; } = "(SELECT NULL)";
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
            switch(sort)
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