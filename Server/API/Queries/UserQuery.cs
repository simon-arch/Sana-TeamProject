using GraphQL;
using GraphQL.Types;
using Server.API.GraphTypes;
using Server.Authorization;
using Server.Data.Extensions;
using Server.Data.Repositories;
using Server.Models;

namespace Server.API.Queries;

public sealed class UserQuery : ObjectGraphType
{
    public UserQuery()
    {
        Field<UserGraphType>("user")
            .Argument<NonNullGraphType<StringGraphType>>("username")
            .ResolveAsync(async context =>
            {
                context.Authorize();

                var username = context.GetArgument<string>("username");
                return await context.RequestServices!.GetRequiredService<IUserRepository>().GetAsync(username);
            });

        Field<ResultSetGraphType<User, UserGraphType>>("users")
            .Argument<IntGraphType>("pageSize")
            .Argument<IntGraphType>("pageNumber")
            .Argument<StringGraphType>("query")
            .ResolveAsync(async context =>
            {
                context.WithPermission(Permission.VIEW_USERS);
                
                bool canViewFired = context.HasPermission(Permission.DELETE_USER) ||
                                       context.HasPermission(Permission.FIRE_USER);

                var pageNumber = context.GetArgument<int?>("pageNumber");
                var pageSize = context.GetArgument<int?>("pageSize");
                var query = context.GetArgument<string?>("query");

                var builder = new GetAllOptionsBuilder();

                if (pageNumber != null && pageSize != null)
                {
                    builder.SetPagination((int)pageNumber, (int)pageSize);
                }
                if (query != null)
                {
                    builder.SetQuery(query);
                }
                builder.IncludeFired(canViewFired);

                return await context.RequestServices!.GetRequiredService<IUserRepository>().GetAllAsync(builder.Build());
            });
    }
}