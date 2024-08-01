using Azure;
using GraphQL;
using GraphQL.Types;
using Server.API.Types;
using Server.Authorization;
using Server.Data.Repositories;

namespace Server.API.Queries
{
    public class UserQuery : ObjectGraphType
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

                    return await context.RequestServices!.GetRequiredService<IUserRepository>().GetAllAsync();
                });
        }
    }
}
