using GraphQL;
using GraphQL.Types;
using Server.API.GraphInputTypes;
using Server.API.GraphTypes;
using Server.Authorization;
using Server.Data.Repositories;
using Server.Models;
using System.Security.Claims;
using Server.API.Extensions;

namespace Server.API.Mutations;

public sealed class UserMutation : ObjectGraphType
{
    public UserMutation()
    {
        Field<UserGraphType>("set_role")
            .Argument<NonNullGraphType<StringGraphType>>("username")
            .Argument<NonNullGraphType<EnumerationGraphType<Role>>>("role")
            .ResolveAsync(async context =>
            {
                context.WithPermission(Permission.MANAGE_USER_ROLES);

                var username = context.GetArgument<string>("username");
                var role = context.GetArgument<Role>("role");

                var sub = context.User?.FindFirstValue(ClaimTypes.NameIdentifier);

                if (sub == username)
                {
                    throw new ExecutionError("Cannot modify own role")
                    {
                        Code = ResponseCode.BadRequest 
                    };
                }

                var user = await context.RequestServices!.GetRequiredService<IUserRepository>().GetAsync(username) 
                    ?? throw new ExecutionError("User not found") { Code = ResponseCode.BadRequest };

                user.Role = role;
                await context.RequestServices!.GetRequiredService<IUserRepository>().UpdateAsync(user);

                return user;
            });

        Field<UserGraphType>("set_permissions")
            .Argument<NonNullGraphType<StringGraphType>>("username")
            .Argument<NonNullGraphType<ListGraphType<EnumerationGraphType<Permission>>>>("permissions")
            .ResolveAsync(async context =>
            {
                context.WithPermission(Permission.MANAGE_USER_PERMISSIONS);

                var username = context.GetArgument<string>("username");
                var permissions = context.GetArgument<Permission[]>("permissions");

                var sub = context.User?.FindFirstValue(ClaimTypes.NameIdentifier);

                if (sub == username)
                {
                    throw new ExecutionError("Cannot modify own permissions")
                    {
                        Code = ResponseCode.BadRequest
                    };
                }

                var user = await context.RequestServices!.GetRequiredService<IUserRepository>().GetAsync(username) 
                    ?? throw new ExecutionError("User not found") { Code = ResponseCode.BadRequest };

                user.Permissions = permissions;
                await context.RequestServices!.GetRequiredService<IUserRepository>().UpdateAsync(user);

                return user;
            });
        
        Field<UserGraphType>("delete_user")
            .Argument<NonNullGraphType<StringGraphType>>("username")
            .ResolveAsync(async context =>
            {
                context.WithPermission(Permission.DELETE_USER);

                var username = context.GetArgument<string>("username");
                var userRepository = context.RequestServices!.GetRequiredService<IUserRepository>();
                var user = await context.RequestServices!.GetRequiredService<IUserRepository>().GetAsync(username)
                    ?? throw new ExecutionError("User not found") { Code = ResponseCode.BadRequest };
                
                await context.RequestServices!.GetRequiredService<IUserRepository>().DeleteAsync(user.Username);
                return user;
            });

        Field<UserGraphType>("update_user")
            .Argument<NonNullGraphType<UserUpdateInputGraphType>>("user")
            .ResolveAsync(async context =>
            {
                context.Authorize();
                var userRepository = context.RequestServices!.GetRequiredService<IUserRepository>();

                var requestUser = context.GetArgument<User>("user");
                var oldUser = await context.RequestServices!.GetRequiredService<IUserRepository>().GetAsync(requestUser.Username)
                    ?? throw new ExecutionError("User not found") { Code = ResponseCode.BadRequest };

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
                    WorkingTime = requestUser.WorkingTime,
                    // ApproveVacationsForUsers = requestUser.ApproveVacationsForUsers,
                    // VacationsApprovedByUsers = requestUser.VacationsApprovedByUsers
                };
                
                await userRepository.UpdateAsync(newUser);
                // await UserMutationExtensions.UpdateUsersVacationsAsync(newUser, userRepository);
                
                return newUser;
            });

        Field<UserGraphType>("set_state")
            .Argument<StringGraphType>("username")
            .Argument<EnumerationGraphType<State>>("state")
            .ResolveAsync(async context =>
            {
                context.Authorize();

                var username = context.GetArgument<string>("username");
                var state = context.GetArgument<State>("state");

                var user = await context.RequestServices!.GetRequiredService<IUserRepository>().GetAsync(username)
                    ?? throw new ExecutionError("User not found") { Code = ResponseCode.BadRequest };

                user.State = state;
                await context.RequestServices!.GetRequiredService<IUserRepository>().UpdateAsync(user);

                return user;
            });
    }
}