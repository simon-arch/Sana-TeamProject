using Server.Models;

namespace Server.Data.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetAsync(string username);
        Task<User?> GetAsync(Guid tokenId);
        Task<ResultSet<User>> GetAllAsync(int pageNumber, int pageSize, string? query);
        Task InsertAsync(User user);
        Task UpdateAsync(User user);
        Task DeleteAsync(string username);
    }
}
