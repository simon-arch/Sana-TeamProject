namespace Server.Models
{
    public class Vacation
    {
        public int Id { get; init; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public required Status Status { get; set; }
        public required string Sender { get; init; }
        public required DateTime StartDate { get; set; }
        public required DateTime EndDate { get; set; }
    }
    public enum Status
    {
        PENDING = 0,
        APPROVED = 1,
        REJECTED = 2
    }
}
