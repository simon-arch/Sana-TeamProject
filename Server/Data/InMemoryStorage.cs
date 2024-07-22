using Server.Authorization;
using Server.Models;

namespace Server.Data
{
    public static class InMemoryStorage
    {
        private static readonly List<User> Users = new List<User>
        {
            new User { Id = 1, Username = Role.UserManager, Password = "psw", Role = Role.UserManager },
            new User { Id = 2, Username = Role.Developer, Password = "psw", Role = Role.Developer}
        };

        public static User? Authenticate(string username, string password) =>
            Users.SingleOrDefault(u => u.Username == username && u.Password == password);

        public static IEnumerable<User> GetUsers() => Users;
    }
}
