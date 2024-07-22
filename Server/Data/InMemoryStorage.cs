using Server.Authorization;
using Server.Models;

namespace Server.Data
{
    public static class InMemoryStorage
    {
        private static readonly List<User> Users = new List<User>
        {
            new User { Id = 1, Username = "John", Password = "psw", Role = Role.UserManager },
            new User { Id = 2, Username = "Doe", Password = "psw", Role = Role.Developer }
        };

        public static User? Authenticate(string username, string password) =>
            Users.SingleOrDefault(u => u.Username == username && u.Password == password);

        public static IEnumerable<User> GetUsers() => Users;
        public static List<string> GetRoles() => Users.Select(user => user.Role).ToList();
        public static Dictionary<string, string> GetUserRoles () => Users.ToDictionary(user => user.Username, user => user.Role.ToString());
    }
}
