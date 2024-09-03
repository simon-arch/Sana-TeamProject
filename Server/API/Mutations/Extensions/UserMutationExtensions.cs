using Server.Data.Repositories;

namespace Server.API.Mutations.Extensions;

public static class UserMutationExtensions
{
    // public static async Task UpdateApproveVacationsForUsersAsync(string username, List<string> vacationsApprovedByUsers, IUserRepository userRepository)
    // {
    //     foreach (var approvingUsername in vacationsApprovedByUsers)
    //     {
    //         var approvingUser = await userRepository.GetAsync(approvingUsername);
    //         if (approvingUser == null) continue;
    //
    //         if (approvingUser.ApproveVacationsForUsers.Contains(username)) continue;
    //
    //         approvingUser.ApproveVacationsForUsers = approvingUser.ApproveVacationsForUsers.Concat(new[] { username }).ToList();
    //         await userRepository.UpdateAsync(approvingUser);
    //     }
    // }
    //
    // public static async Task RemoveApproveVacationsForUsersAsync(string usernameToRemove, IUserRepository userRepository)
    // {
    //     var allUsers = await userRepository.GetAllAsync();
    //
    //     foreach (var user in allUsers.Results)
    //     {
    //         if (!user.ApproveVacationsForUsers.Contains(usernameToRemove)) continue;
    //
    //         user.ApproveVacationsForUsers = user.ApproveVacationsForUsers
    //             .Where(u => u != usernameToRemove)
    //             .ToList();
    //         
    //         await userRepository.UpdateAsync(user);
    //     }
    // }

}