using Server.Authorization;

namespace Server.Models;

public class User
{
    public required string Username { get; init; }
    public required string PasswordHash { get; set; }
    public Guid? TokenId { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required Role Role { get; set; }
    public required Permission[] Permissions { get; set; }
    public required State State { get; set; } = State.Available;
    public required WorkType WorkType { get; set; } = WorkType.FullTime;
    public decimal? WorkTime { get; set; }
}

public enum State
{
    Available = 0,
    Vacation = 1,
    Fired = 2
}

public enum WorkType
{
    FullTime = 0,
    PartTime = 1
}