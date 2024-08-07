using Server.Models;

namespace Server.Data.Repositories
{
    public interface ITimeStampRepository
    {
        Task<TimeStamp?> GetAsync(int id);
        Task<IEnumerable<TimeStamp>> GetAsync(string username);
        Task<IEnumerable<TimeStamp>> GetAllAsync();
        Task<int> InsertAsync(TimeStamp timeStamp);
        Task UpdateAsync(TimeStamp timeStamp);
        Task DeleteAsync(int id);
    }
}