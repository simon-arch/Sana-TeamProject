using Server.Models;

namespace Server.Data.Repositories
{
    public interface ITimeStampRepository
    {
        Task<TimeStamp?> GetAsync(int id);
        Task<TimeStamp?> GetLatestAsync(string username);
        Task<IEnumerable<TimeStamp>> GetAsync(string username);
        Task<IEnumerable<TimeStamp>> GetByInterval(DateTime dateStart, DateTime dateEnd, string username);
        Task<ResultSet<TimeStamp>> GetAsync(string username, int pageSize, int pageNumber);
        Task<IEnumerable<TimeStamp>> GetAllAsync();
        Task<int> InsertAsync(TimeStamp timeStamp);
        Task UpdateAsync(TimeStamp timeStamp);
        Task DeleteAsync(int id);
    }
}