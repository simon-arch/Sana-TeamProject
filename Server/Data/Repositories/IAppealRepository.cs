using Server.Models;

namespace Server.Data.Repositories
{
    public interface IAppealRepository
    {
        Task<IEnumerable<Appeal>> GetAsync(string username);
        Task<Appeal?> GetAsync(int id);
        Task<IEnumerable<Appeal>> GetAllAsync();
        Task<int> InsertAsync(Appeal appeal);
        Task UpdateAsync(Appeal appeal);
        Task DeleteAsync(int id);
    }
}