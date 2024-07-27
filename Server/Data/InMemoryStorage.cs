using Server.Authorization;
using Server.Models;

namespace Server.Data
{
    public static class InMemoryStorage
    {
        private static readonly IList<User> Users =
        [
            new() { Id = 1, Username = "John", Password = "psw", Role = Role.RoleManager },
            new() { Id = 2, Username = "Mark", Password = "psw", Role = Role.PermissionManager },
            new() { Id = 3, Username = "Tony", Password = "psw", Role = Role.Developer },
        ];

        public static User? Authenticate(string username, string password) =>
            Users.SingleOrDefault(user => user.Username == username && user.Password == password);

        public static IDictionary<int, Dictionary<string, object>> GetUsers() =>
            Users.ToDictionary(user => user.Id, user => new Dictionary<string, object> {
                { "Role", user.Role.ToString() },
                { "Name", user.Username },
                { "Permissions", GetPermissions(user.Role) }
            });
        public static IEnumerable<string> GetPermissions(string role)
        {
            if (Role.Permissions.TryGetValue(role, out var permissions))
            {
                return permissions.Select(p => p.ToString());
            }
            return Enumerable.Empty<string>();
        }
        public static IEnumerable<string> GetRoles() => 
            Users.Select(user => user.Role);

        public static IEnumerable<string> GetPermissions() =>
            Enum.GetNames(typeof(Permission));
        public static IEnumerable<string> GetPermissionsForRole(string role) =>
            Role.Permissions.TryGetValue(role, out var value) ? value.Select(perm => perm.ToString()) : [];
    }
}
