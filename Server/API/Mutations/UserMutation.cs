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
                .Argument<IntGraphType>("id")
                .Argument<EnumerationGraphType<Role>>("role")
                .ResolveAsync(async context =>
                {
                    var id = context.GetArgument<int>("id");
                    var role = context.GetArgument<Role>("role");

                    var user = await context.RequestServices!.GetRequiredService<IUserRepository>().GetAsync(id);
                    if (user == null)
                    {
                        context.Errors.Add(new("User not found."));
                        return string.Empty;
                    }

                    user.Role = role;
                    await context.RequestServices!.GetRequiredService<IUserRepository>().UpdateAsync(user);

                    return user;
                });

            Field<UserGraphType>("set_permissions")
                .Argument<IntGraphType>("id")
                .Argument<ListGraphType<EnumerationGraphType<Permission>>>("permissions")
                .ResolveAsync(async context =>
                {
                    var id = context.GetArgument<int>("id");
                    var permissions = context.GetArgument<Permission[]>("permissions");

                    var user = await context.RequestServices!.GetRequiredService<IUserRepository>().GetAsync(id);
                    if (user == null)
                    {
                        context.Errors.Add(new("User not found."));
                        return string.Empty;
                    }

                    user.Permissions = permissions;
                    await context.RequestServices!.GetRequiredService<IUserRepository>().UpdateAsync(user);

                    return user;
                });
        }
    }
}
