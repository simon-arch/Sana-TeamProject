using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Options;
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
                SELECT Username, PasswordHash, TokenId, FirstName, LastName, Role, Permissions, State, WorkType, WorkingTime
                FROM Users
                WHERE {condition}";

            return _sql.QueryFirstOrDefaultAsync<User>(query);
        }

        public Task<ResultSet<User>> GetAllAsync() => GetAllAsync(new GetAllOptions());

        public async Task<ResultSet<User>> GetAllAsync(GetAllOptions options)
        {           
            var pagination = options.PageNumber != null && options.PageSize != null 
                ? $@"ORDER BY (SELECT NULL)
                     OFFSET {(options.PageNumber - 1) * options.PageSize} ROWS FETCH NEXT {options.PageSize} ROWS ONLY"
                : string.Empty;

            string sql = @$"
                SELECT Username, PasswordHash, TokenId, FirstName, LastName, Role, Permissions, State, WorkType, WorkingTime 
                FROM Users
                {options.Condition}
                {pagination}";

            return new ResultSet<User>
            {
                TotalCount = await _CountAsync(options.Condition),
                Results = await _sql.QueryAsync<User>(sql)
            };
        }

        public Task InsertAsync(User user)
        {
            string query = @"
                INSERT INTO Users (Username, PasswordHash, TokenId, FirstName, LastName, Role, Permissions, State, WorkType, WorkingTime)
                VALUES (@Username, @PasswordHash, @TokenId, @FirstName, @LastName, @Role, @Permissions, @State, @WorkType, @WorkingTime)";

            return _sql.ExecuteAsync(query, user);
        }

        public Task UpdateAsync(User user)
        {
            string query = $@"
                UPDATE Users
                SET PasswordHash = @PasswordHash, TokenId = @TokenId, FirstName = @FirstName,
                LastName = @LastName, Role = @Role, Permissions = @Permissions, State = @State, WorkType = @WorkType, WorkingTime = @WorkingTime
                WHERE Username = @Username";

            return _sql.ExecuteAsync(query, user);
        }

        public Task DeleteAsync(string username) =>
            _sql.ExecuteAsync($"DELETE FROM Users WHERE Username = '{username}'");
    }

    public class GetAllOptions
    {
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string Condition { get; set; } = string.Empty;
    }

    public class GetAllOptionsBuilder
    {
        private readonly GetAllOptions _options = new();
        private readonly List<string> _conditions = [];

        public GetAllOptionsBuilder SetPageNumber(int pageNumber)
        {
            ArgumentOutOfRangeException.ThrowIfNegativeOrZero(pageNumber);

            _options.PageNumber = pageNumber;
            return this;
        }

        public GetAllOptionsBuilder SetPageSize(int pageSize)
        {
            ArgumentOutOfRangeException.ThrowIfNegative(pageSize);

            _options.PageSize = pageSize;
            return this;
        }

        public GetAllOptionsBuilder SetQuery(string? query)
        {
            if (!string.IsNullOrEmpty(query))
            {
                _conditions.Add($"CONCAT(FirstName, ' ', LastName) LIKE '{query}%'");
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
            if (_options.PageNumber != null ^ _options.PageSize != null)
            {
                throw new InvalidOperationException("Both PageNumber and PageSize must be set together.");
            }

            if (_conditions.Count > 0)
                _options.Condition = "WHERE " + string.Join(" AND ", _conditions);

            return _options;
        }
    }
}