using GraphQL;
using GraphQL.Types;
using Server.API.Types;
using Server.Authorization;
using Server.Data.Repositories;

namespace Server.API.Queries
{
    [Authorize]
    public class UserQuery : ObjectGraphType
    {
        public UserQuery()
        {
            this.AuthorizeWithPolicy(Permission.ViewUsers.ToString());

            Field<UserGraphType>("get")
                .Argument<IdGraphType>("id")
                .ResolveAsync(async context =>
                {
                    var user = context.User;

                    int id = context.GetArgument<int>("id");
                    return await context.RequestServices!.GetRequiredService<IUserRepository>().GetAsync(id);
                });

            Field<ListGraphType<UserGraphType>>("get_all")
                .ResolveAsync(async context =>
                    await context.RequestServices!.GetRequiredService<IUserRepository>().GetAllAsync());
        }
    }
}
