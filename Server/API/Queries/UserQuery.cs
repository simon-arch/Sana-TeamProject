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
                .Argument<IdGraphType>("id")
                .ResolveAsync(async context =>
                {
                    context.WithPermission(Permission.ViewUsers);

                    int id = context.GetArgument<int>("id");
                    return await context.RequestServices!.GetRequiredService<IUserRepository>().GetAsync(id);
                });

            Field<ListGraphType<UserGraphType>>("get_all")
                .ResolveAsync(async context =>
                {
                    context.WithPermission(Permission.ViewUsers);

                    return await context.RequestServices!.GetRequiredService<IUserRepository>().GetAllAsync();
                });
        }
    }
}
