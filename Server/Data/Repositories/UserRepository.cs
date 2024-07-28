using Dapper;
using Microsoft.Data.SqlClient;
using Server.Models;

namespace Server.Data.Repositories
{
    public class UserRepository(DbProvider provider) : IUserRepository
    {
        private readonly SqlConnection _sql = provider.Connection;

        public Task<User?> GetAsync(int id)
        {
            string query = $@"
                SELECT Id, Username, PasswordHash, FirstName, LastName, Role, Permissions
                FROM Users
                WHERE Id = {id}";

            return _sql.QuerySingleAsync<User?>(query);
        }

        public Task<User?> GetAsync(string username)
        {
            string query = $@"
                SELECT Id, Username, PasswordHash, FirstName, LastName, Role, Permissions
                FROM Users
                WHERE Username = '{username}'";

            return _sql.QuerySingleAsync<User?>(query);
        }

        public Task<IEnumerable<User>> GetAllAsync()
        {
            string query = @"
                SELECT Id, Username, PasswordHash, FirstName, LastName, Role, Permissions
                FROM Users";

            return _sql.QueryAsync<User>(query);
        }

        public Task<int> InsertAsync(User user)
        {
            string query = @"
                INSERT INTO Users (Username, PasswordHash, FirstName, LastName, Role, Permissions)
                OUTPUT inserted.Id
                VALUES (@Username, @PasswordHash, @FirstName, @LastName, @Role, @Permissions)";

            return _sql.QuerySingleAsync<int>(query, user);
        }

        public Task UpdateAsync(User user)
        {
            string query = $@"
                UPDATE Users
                SET Username = @Username, PasswordHash = @PasswordHash, FirstName = @FirstName,
                LastName = @LastName, Role = @Role, Permissions = @Permissions
                WHERE Id = @Id";

            return _sql.ExecuteAsync(query, user);
        }

        public Task DeleteAsync(int id) => 
            _sql.ExecuteAsync($"DELETE FROM Users WHERE Id = {id}");

    }
}
