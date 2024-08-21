using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
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
                SELECT Username, PasswordHash, TokenId, FirstName, LastName, Role, Permissions, State, WorkType, WorkTime
                FROM Users
                WHERE {condition}";

            return _sql.QueryFirstOrDefaultAsync<User>(query);
        }

        public Task<ResultSet<User>> GetAllAsync() => GetAllAsync(new GetAllOptions());

        public async Task<ResultSet<User>> GetAllAsync(GetAllOptions options)
        {           
            string sql = @$"
                SELECT Username, PasswordHash, TokenId, FirstName, LastName, Role, Permissions, State, WorkType, WorkTime 
                FROM Users
                {options.Condition}
                {options.Pagination}";

            return new ResultSet<User>
            {
                TotalCount = await _CountAsync(options.Condition),
                Results = await _sql.QueryAsync<User>(sql)
            };
        }

        public Task InsertAsync(User user)
        {
            string query = @"
                INSERT INTO Users (Username, PasswordHash, TokenId, FirstName, LastName, Role, Permissions, State, WorkType, WorkTime)
                VALUES (@Username, @PasswordHash, @TokenId, @FirstName, @LastName, @Role, @Permissions, @State, @WorkType, @WorkTime)";

            return _sql.ExecuteAsync(query, user);
        }

        public Task UpdateAsync(User user)
        {
            string query = $@"
                UPDATE Users
                SET PasswordHash = @PasswordHash, TokenId = @TokenId, FirstName = @FirstName,
                LastName = @LastName, Role = @Role, Permissions = @Permissions, State = @State, WorkType = @WorkType, WorkTime = @WorkTime
                WHERE Username = @Username";

            return _sql.ExecuteAsync(query, user);
        }

        public Task DeleteAsync(string username) =>
            _sql.ExecuteAsync($"DELETE FROM Users WHERE Username = '{username}'");
    }

    public class GetAllOptions
    {
        public string Pagination { get; set; } = string.Empty;
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

            _options.Pagination = $@"
                ORDER BY (SELECT NULL)
                OFFSET {(pageNumber - 1) * pageSize} ROWS FETCH NEXT {pageSize} ROWS ONLY";
            
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

            return _options;
        }
    }
}