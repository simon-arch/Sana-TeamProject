using Dapper;
using Microsoft.Data.SqlClient;
using Server.Models;

namespace Server.Data.Repositories
{
    public class UserRepository(DbProvider provider) : IUserRepository
    {
        private readonly SqlConnection _sql = provider.Connection;

        public Task<User?> GetAsync(int id) => _GetAsync($"Id = {id}");

        public Task<User?> GetAsync(string username) => _GetAsync($"Username = '{username}'");

        public Task<User?> GetAsync(Guid tokenId) => _GetAsync($"TokenId = '{tokenId}'");

        private Task<User?> _GetAsync(string condition)
        {
            string query = $@"
                SELECT Id, Username, PasswordHash, TokenId, FirstName, LastName, Role, Permissions
                FROM Users
                WHERE {condition}";

            return _sql.QuerySingleAsync<User?>(query);
        }

        public Task<IEnumerable<User>> GetAllAsync()
        {
            string query = @"
                SELECT Id, Username, PasswordHash, TokenId, FirstName, LastName, Role, Permissions
                FROM Users";

            return _sql.QueryAsync<User>(query);
        }

        public Task<int> InsertAsync(User user)
        {
            string query = @"
                INSERT INTO Users (Username, PasswordHash, TokenId, FirstName, LastName, Role, Permissions)
                OUTPUT inserted.Id
                VALUES (@Username, @PasswordHash, @TokenId, @FirstName, @LastName, @Role, @Permissions)";

            return _sql.QuerySingleAsync<int>(query, user);
        }

        public Task UpdateAsync(User user)
        {
            string query = $@"
                UPDATE Users
                SET Username = @Username, PasswordHash = @PasswordHash, TokenId = @TokenId,
                FirstName = @FirstName, LastName = @LastName, Role = @Role, Permissions = @Permissions
                WHERE Id = @Id";

            return _sql.ExecuteAsync(query, user);
        }

        public Task DeleteAsync(int id) => 
            _sql.ExecuteAsync($"DELETE FROM Users WHERE Id = {id}");

    }
}
