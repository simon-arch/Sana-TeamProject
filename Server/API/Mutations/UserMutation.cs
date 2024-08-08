using GraphQL;
using GraphQL.Types;
using Server.API.GraphTypes;
using Server.Authorization;
using Server.Data.Repositories;
using System.Security.Claims;

namespace Server.API.Mutations;

public sealed class UserMutation : ObjectGraphType
{
    public UserMutation()
    {
        Field<UserGraphType>("set_role")
            .Argument<StringGraphType>("username")
            .Argument<EnumerationGraphType<Role>>("role")
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
            .Argument<StringGraphType>("username")
            .Argument<ListGraphType<EnumerationGraphType<Permission>>>("permissions")
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
            .Argument<StringGraphType>("username")
            .ResolveAsync(async context =>
            {
                context.WithPermission(Permission.DELETE_USER);

                var username = context.GetArgument<string>("username");
                var user = await context.RequestServices!.GetRequiredService<IUserRepository>().GetAsync(username)
                    ?? throw new ExecutionError("User not found") { Code = ResponseCode.BadRequest };

                await context.RequestServices!.GetRequiredService<IUserRepository>().DeleteAsync(user.Username);
                return user;
            });

    }
}