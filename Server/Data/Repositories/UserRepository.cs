using Dapper;
using Microsoft.Data.SqlClient;
using Server.Models;

namespace Server.Data.Repositories
{
    public class UserRepository(DbProvider provider) : IUserRepository
    {
        private readonly SqlConnection _sql = provider.Connection;

        public Task<User?> GetAsync(string username) => _GetAsync($"Username = '{username}'");

        public Task<User?> GetAsync(Guid tokenId) => _GetAsync($"TokenId = '{tokenId}'");

        private Task<User?> _GetAsync(string condition)
        {
            string query = $@"
                SELECT Username, PasswordHash, TokenId, FirstName, LastName, Role, Permissions
                FROM Users
                WHERE {condition}";

            return _sql.QueryFirstOrDefaultAsync<User>(query);
        }

        public Task<IEnumerable<User>> GetAllAsync()
        {
            string query = @"
                SELECT Username, PasswordHash, TokenId, FirstName, LastName, Role, Permissions
                FROM Users";

            return _sql.QueryAsync<User>(query);
        }

        public Task InsertAsync(User user)
        {
            string query = @"
                INSERT INTO Users (Username, PasswordHash, TokenId, FirstName, LastName, Role, Permissions)
                VALUES (@Username, @PasswordHash, @TokenId, @FirstName, @LastName, @Role, @Permissions)";

            return _sql.ExecuteAsync(query, user);
        }

        public Task UpdateAsync(User user)
        {
            string query = $@"
                UPDATE Users
                SET PasswordHash = @PasswordHash, TokenId = @TokenId, FirstName = @FirstName,
                LastName = @LastName, Role = @Role, Permissions = @Permissions
                WHERE Username = @Username";

            return _sql.ExecuteAsync(query, user);
        }

        public Task DeleteAsync(string username) => 
            _sql.ExecuteAsync($"DELETE FROM Users WHERE Username = '{username}'");

    }
}
