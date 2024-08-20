using Server.Models;

namespace Server.Data.Repositories
{
    public interface IPlanRepository
    {
        Task<Plan?> GetAsync(int id);
        Task<IEnumerable<Plan>> GetAllAsync(string[] usernames);
        Task<int> InsertAsync(Plan plan);
        Task UpdateAsync(Plan plan);
        Task DeleteAsync(int id);
    }
}