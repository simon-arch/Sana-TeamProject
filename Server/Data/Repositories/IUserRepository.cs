using Server.Authorization;
using Server.Models;

namespace Server.Data.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetAsync(string username);
        Task<User?> GetAsync(Guid tokenId);
        Task<ResultSet<User>> GetAllAsync();
        Task<ResultSet<User>> GetAllAsync(GetAllOptions options);
        Task<IEnumerable<User>> GetUsersWithPermissionsAsync(Permission[] permissions);
        Task<IEnumerable<User>> GetUsersByApproverAsync(string currentUsername);
        Task InsertAsync(User user);
        Task UpdateAsync(User user);
        Task DeleteAsync(string username);
    }
}
