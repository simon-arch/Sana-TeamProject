using Dapper;
using Microsoft.Data.SqlClient;
using Server.Authorization;

namespace Server.Data
{
    public class DbProvider
    {
        private readonly IConfiguration _configuration;

        public DbProvider(IConfiguration configuration)
        {
            _configuration = configuration;
            CreateDefaultObjectsInDb();
        }

        public SqlConnection Connection => new SqlConnection(_configuration.GetConnectionString("Default"));

        private string GetSqlScriptFromFile(string fileName)
        {
            var filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"..\..\..", "Scripts", fileName);
            return File.ReadAllText(Path.GetFullPath(filePath));
        }

        private void CreateDefaultObjectsInDb()
        {
            using var connection = Connection;
            connection.Open();

            var userTablePath = GetSqlScriptFromFile("CreateUsersTable.sql");
            connection.Execute(userTablePath);

            var defaultUserPath = GetSqlScriptFromFile("CreateDefaultUser.sql");
            connection.Execute(defaultUserPath, new
            {
                Username = "Manager",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("123"),
                FirstName = "John",
                LastName = "Doe",
                Role = Role.UserManager,
                Permissions = Enum.GetValues(typeof(Permission)).Cast<Permission>().ToArray()
            });
        }
    }
}