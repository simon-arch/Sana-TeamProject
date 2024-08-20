namespace Server.Models
{
    public class Plan
    {
        public int Id { get; init; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public required DateTime TimeStart { get; set; }
        public DateTime TimeEnd { get; set; }
        public required string Owner { get; set; }
    }
}