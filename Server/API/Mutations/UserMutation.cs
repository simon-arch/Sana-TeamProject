using GraphQL;
using GraphQL.Types;
using Server.API.Types;
using Server.Authorization;
using Server.Data.Repositories;

namespace Server.API.Mutations
{
    public class UserMutation : ObjectGraphType
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

                    var user = await context.RequestServices!.GetRequiredService<IUserRepository>().GetAsync(username) 
                        ?? throw new ExecutionError("User not found") { Code = ResponseCode.BadRequest };

                    user.Permissions = permissions;
                    await context.RequestServices!.GetRequiredService<IUserRepository>().UpdateAsync(user);

                    return user;
                });
        }
    }
}
