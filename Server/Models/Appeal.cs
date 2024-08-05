namespace Server.Models
{
    public class Appeal
    {
        public int Id { get; init; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public required Type Type { get; set; }
        public required Status Status { get; set; }
        public required string Sender { get; init; }
    }
    public enum Status
    {
        PENDING = 0,
        APPROVED = 1,
        REJECTED = 2
    }
    public enum Type
    {
        HOSPITAL = 0,
        VACATION = 1,
        DISCHARGE = 2,
        PROPOSAL = 3
    }
}
