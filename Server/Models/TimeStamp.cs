namespace Server.Models
{
    public class TimeStamp
    {
        public int Id { get; init; }
        public required string Username { get; set; }
        public required DateTime TimeStart { get; set; }
        public DateTime? TimeEnd { get; set; }
        public required Source Source { get; set; }
    }
    public enum Source
    {
        SYSTEM = 0,
        USER = 1
    }
}