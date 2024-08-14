using Dapper;
using Microsoft.Data.SqlClient;
using Server.Models;

namespace Server.Data.Repositories;

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

    public async Task<ResultSet<User>> GetAllAsync(int pageNumber, int pageSize, string? query)
    {
        var condition = query != null
            ? $"WHERE CONCAT(FirstName, ' ', LastName) LIKE '{query}%'"
            : string.Empty;

        string sql = @$"
                SELECT Username, PasswordHash, TokenId, FirstName, LastName, Role, Permissions, State, WorkType, WorkingTime 
                FROM Users
                {condition}
                ORDER BY (SELECT NULL)
                OFFSET {(pageNumber - 1) * pageSize} ROWS FETCH NEXT {pageSize} ROWS ONLY";

        return new ResultSet<User>
        {
            TotalCount = await _CountAsync(condition),
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