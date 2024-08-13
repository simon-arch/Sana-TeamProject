using GraphQL;
using GraphQL.Types;
using Server.API.GraphTypes;
using Server.Authorization;
using Server.Data.Repositories;
using Server.Models;

namespace Server.API.Queries;

public sealed class UserQuery : ObjectGraphType
{
    public UserQuery()
    {
        Field<UserGraphType>("get")
            .Argument<StringGraphType>("username")
            .ResolveAsync(async context =>
            {
                context.WithPermission(Permission.VIEW_USERS);

                var username = context.GetArgument<string>("username");
                return await context.RequestServices!.GetRequiredService<IUserRepository>().GetAsync(username);
            });

        Field<ListGraphType<UserGraphType>>("get_all")
            .ResolveAsync(async context =>
            {
                context.WithPermission(Permission.VIEW_USERS);
                
                bool canViewFullList = context.HasPermission(Permission.DELETE_USER) ||
                                       context.HasPermission(Permission.FIRING_USERS);

                if (canViewFullList)
                {
                    return await context.RequestServices!.GetRequiredService<IUserRepository>().GetAllAsync();
                }
                else
                {
                    return (await context.RequestServices!.GetRequiredService<IUserRepository>().GetAllAsync())
                        .Where(user => user.State != State.Fired)
                        .ToList();
                }
            });


    }
}