using Server.Models;

namespace Server.Data.Repositories
{
    public interface IPlanRepository
    {
        Task<Plan?> GetAsync(int id);
        Task<IEnumerable<Plan>> GetAsync(string username);
        Task<IEnumerable<Plan>> GetAllAsync();
        Task<int> InsertAsync(Plan plan);
        Task UpdateAsync(Plan plan);
        Task DeleteAsync(int id);
    }
}