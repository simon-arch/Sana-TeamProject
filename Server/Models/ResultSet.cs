namespace Server.Models
{
    public class ResultSet<T>
    {
        public required int TotalCount { get; init; }
        public required IEnumerable<T> Results { get; set; }
    }
}
