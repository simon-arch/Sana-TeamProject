﻿using Server.Models;

namespace Server.Data.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetAsync(string username);
        Task<User?> GetAsync(Guid tokenId);
        Task<IEnumerable<User>> GetAllAsync();
        Task InsertAsync(User user);
        Task UpdateAsync(User user);
        Task DeleteAsync(string username);
    }
}