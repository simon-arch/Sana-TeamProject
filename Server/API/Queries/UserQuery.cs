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
        Field<UserGraphType>("get")
            .Argument<NonNullGraphType<StringGraphType>>("username")
            .ResolveAsync(async context =>
            {
                context.Authorize();

                var username = context.GetArgument<string>("username");
                return await context.RequestServices!.GetRequiredService<IUserRepository>().GetAsync(username);
            });

        Field<ResultSetGraphType<User, UserGraphType>>("get_all")
            .Argument<NonNullGraphType<IntGraphType>>("page_size")
            .Argument<NonNullGraphType<IntGraphType>>("page_number")
            .Argument<StringGraphType>("query")
            .ResolveAsync(async context =>
            {
                context.WithPermission(Permission.VIEW_USERS);

                var pageNumber = context.GetArgument<int>("page_number");
                var pageSize = context.GetArgument<int>("page_size");
                var query = context.GetArgument<string?>("query");

                return await context.RequestServices!.GetRequiredService<IUserRepository>().GetAllAsync(options => options
                    .SetPageNumber(pageNumber)
                    .SetPageSize(pageSize)
                    .SetQuery(query)
                );
            });
    }
}