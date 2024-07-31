using Dapper;
using Microsoft.Data.SqlClient;
using Server.Models;

namespace Server.Data.Repositories
{
    public class UserRepository(DbProvider provider) : IUserRepository
    {
        private readonly SqlConnection _sql = provider.Connection;

        public async Task<User?> GetAsync(int id)
        {
            var query = $@"
                SELECT Id, Username, PasswordHash, FirstName, LastName, Role, Permissions
                FROM Users
                WHERE Id = {id}";

            return await _sql.QuerySingleAsync<User?>(query);
        }

        public async Task<User?> GetAsync(string username)
        {
            var query = $@"
                SELECT Id, Username, PasswordHash, FirstName, LastName, Role, Permissions
                FROM Users
                WHERE Username = '{username}'";

            return await _sql.QuerySingleAsync<User?>(query);
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            var query = @"
                SELECT Id, Username, PasswordHash, FirstName, LastName, Role, Permissions
                FROM Users";

            return await _sql.QueryAsync<User>(query);
        }

        public async Task<int> InsertAsync(User user)
        {
            var query = @"
                INSERT INTO Users (Username, PasswordHash, FirstName, LastName, Role, Permissions)
                OUTPUT inserted.Id
                VALUES (@Username, @PasswordHash, @FirstName, @LastName, @Role, @Permissions)";

            var newId = await _sql.ExecuteScalarAsync<int>(query, user);
            return user.Id = newId;
        }

        public async Task UpdateAsync(User user)
        {
            var query = @"
                UPDATE Users
                SET Username = @Username, PasswordHash = @PasswordHash, FirstName = @FirstName,
                LastName = @LastName, Role = @Role, Permissions = @Permissions
                WHERE Id = @Id";

            await _sql.ExecuteAsync(query, user);
        }

        public async Task DeleteAsync(int id) => 
           await _sql.ExecuteAsync($"DELETE FROM Users WHERE Id = {id}");

    }
}
