using Server.Authorization;
using Server.Models;

namespace Server.Data
{
    public static class InMemoryStorage
    {
        private static readonly IList<User> Users =
        [
            new() { Id = 1, Username = "John", Password = "psw", Role = Role.UserManager },
            new() { Id = 2, Username = "Doe", Password = "psw", Role = Role.Developer }
        ];

        public static User? Authenticate(string username, string password) =>
            Users.SingleOrDefault(user => user.Username == username && user.Password == password);

        public static IDictionary<string, string> GetUsers() =>
            Users.ToDictionary(user => user.Username, user => user.Role.ToString());

        public static IEnumerable<string> GetRoles() => 
            Users.Select(user => user.Role);

        public static IEnumerable<string> GetPermissionsForRole(string role) =>
            Role.Permissions.TryGetValue(role, out var value) ? value.Select(perm => perm.ToString()) : [];
    }
}
