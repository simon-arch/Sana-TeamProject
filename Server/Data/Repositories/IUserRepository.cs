using Server.Models;

namespace Server.Data.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetAsync(int id);
        Task<User?> GetAsync(string username);
        Task<IEnumerable<User>> GetAllAsync();
        Task<int> InsertAsync(User user);
        Task UpdateAsync(User user);
        Task DeleteAsync(int id);
    }
}
