using GraphQL;
using GraphQL.Types;
using Server.API.GraphInputTypes;
using Server.API.GraphTypes;
using Server.Authorization;
using Server.Data.Repositories;
using Server.Models;
using System.Security.Claims;
using Server.API.Mutations.Extensions;

namespace Server.API.Mutations;

public sealed class UserMutation : ObjectGraphType
{
    public UserMutation()
    {        
        Field<UserGraphType>("delete")
            .Argument<NonNullGraphType<StringGraphType>>("username")
            .ResolveAsync(async context =>
            {
                context.WithPermission(Permission.DeleteUser);

                var username = context.GetArgument<string>("username");
                var repository = context.RequestServices!.GetRequiredService<IUserRepository>();
                var user = await repository.GetAsync(username)
                    ?? throw new ExecutionError("User not found") { Code = ResponseCode.BadRequest };

                await repository.DeleteAsync(user.Username);
                await UserMutationExtensions.RemoveApproveVacationsForUsersAsync(user.Username, repository);
                return user;
            });

        Field<UserGraphType>("update")
            .Argument<NonNullGraphType<UserUpdateInputGraphType>>("user")
            .ResolveAsync(async context =>
            {
                context.Authorize();

                var requestUser = context.GetArgument<User>("user");
                var repository = context.RequestServices!.GetRequiredService<IUserRepository>();
                var oldUser = await repository.GetAsync(requestUser.Username)
                    ?? throw new ExecutionError("User not found") { Code = ResponseCode.BadRequest };

                var username = context.User?.FindFirstValue(ClaimTypes.NameIdentifier);

                if (username == oldUser.Username)
                {
                    throw new ExecutionError("Cannot modify own yourself")
                    {
                        Code = ResponseCode.BadRequest
                    };
                }

                var newUser = new User
                {
                    Username = requestUser.Username,
                    PasswordHash = oldUser.PasswordHash,
                    TokenId = oldUser.TokenId,
                    FirstName = requestUser.FirstName,
                    LastName = requestUser.LastName,
                    Role = requestUser.Role,
                    Permissions = requestUser.Permissions,
                    State = oldUser.State,
                    WorkType = requestUser.WorkType,
                    WorkTime = requestUser.WorkTime,
                    ApprovedVacationsByUsers = requestUser.ApprovedVacationsByUsers
                };

                await repository.UpdateAsync(newUser);
                await UserMutationExtensions.UpdateApproveVacationsForUsersAsync(
                    newUser.Username, 
                    newUser.ApprovedVacationsByUsers, 
                    repository);
                return newUser;
            });

        Field<UserGraphType>("setState")
            .Argument<StringGraphType>("username")
            .Argument<EnumerationGraphType<State>>("state")
            .ResolveAsync(async context =>
            {
                context.Authorize();

                var username = context.GetArgument<string>("username");
                var state = context.GetArgument<State>("state");
                
                var repository = context.RequestServices!.GetRequiredService<IUserRepository>();
                
                var user = await repository.GetAsync(username)
                    ?? throw new ExecutionError("User not found") { Code = ResponseCode.BadRequest };
                
                user.State = state;
                await context.RequestServices!.GetRequiredService<IUserRepository>().UpdateAsync(user);

                return user;
            });
    }
}