using Server.Authorization;

namespace Server.Models
{
    public class User
    {
        public required string Username { get; init; }
        public required string PasswordHash { get; set; }
        public Guid? TokenId { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required Role Role { get; set; }
        public required Permission[] Permissions { get; set; }
        public required State State { get; set; } = State.Avaliable;
    }
    public enum State
    {
        Avaliable = 0,
        Vacation = 1,
        Fired = 2
    }
}
