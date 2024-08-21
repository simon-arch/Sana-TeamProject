using Server.Data.Repositories;
using Server.Models;

namespace Server.API.Extensions;

public static class UserMutationExtensions
{
    public static async Task UpdateUsersVacationsAsync(User user, IUserRepository userRepository)
    {
        var usersToUpdate = user.VacationsApprovedByUsers;

        foreach (var username in usersToUpdate)
        {
            var approvingUser = await userRepository.GetAsync(username);
            if (approvingUser == null) continue;

            if (approvingUser.ApproveVacationsForUsers.Contains(user.Username)) continue;
            approvingUser.ApproveVacationsForUsers = approvingUser.ApproveVacationsForUsers.Concat(new[] { user.Username }).ToList();
            await userRepository.UpdateAsync(approvingUser);
        }
    }
}