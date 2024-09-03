namespace Server.Models;

public class VacationApprovers
{
    public required string UserUsername { get; set; }
    public List<string> ApprovedVacationsByUsers { get; set; } = [];
    
    public User? User { get; set; }
}