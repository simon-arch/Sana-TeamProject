using Server.Models;

namespace Server.Data.Repositories
{
    public interface IVacationRepository
    {
        Task<IEnumerable<Vacation>> GetAsync(string username);
        Task<Vacation?> GetAsync(int id);
        Task<IEnumerable<Vacation>> GetAllAsync();
        Task<int> InsertAsync(Vacation appeal);
        Task UpdateAsync(Vacation appeal);
        Task DeleteAsync(int id);
    }
}