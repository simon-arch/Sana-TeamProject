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
        Field<UserGraphType>("user")
            .Argument<NonNullGraphType<StringGraphType>>("username")
            .ResolveAsync(async context =>
            {
                context.Authorize();

                var username = context.GetArgument<string>("username");
                Console.WriteLine($"Fetching user data for: {username}");

                var user = await context.RequestServices!.GetRequiredService<IUserRepository>().GetAsync(username);

                if (user == null)
                {
                    Console.WriteLine($"No user found for: {username}");
                }
                else
                {
                    Console.WriteLine($"User fetched successfully: {user.Username}");
                }

                return user;
            });


        Field<ResultSetGraphType<User, UserGraphType>>("users")
            .Argument<IntGraphType>("pageSize")
            .Argument<IntGraphType>("pageNumber")
            .Argument<EnumerationGraphType<Sort>>("sort")
            .Argument<StringGraphType>("query")
            .Argument<NonNullGraphType<BooleanGraphType>>("includeFired")
            .ResolveAsync(async context =>
            {
                context.WithPermission(Permission.ViewUsers);

                var pageNumber = context.GetArgument<int?>("pageNumber");
                var pageSize = context.GetArgument<int?>("pageSize");
                var sort = context.GetArgument<Sort?>("sort");
                var query = context.GetArgument<string?>("query");
                var includeFired = context.GetArgument<bool>("includeFired");

                var builder = new GetAllOptionsBuilder();

                if (pageNumber != null && pageSize != null)
                {
                    builder.SetPagination((int)pageNumber, (int)pageSize);
                }
                if (sort != null)
                {
                    builder.SortBy((Sort)sort);
                }
                if (query != null)
                {
                    builder.SetQuery(query);
                }
                builder.IncludeFired(includeFired);

                return await context.RequestServices!.GetRequiredService<IUserRepository>().GetAllAsync(builder.Build());
            });
        
        Field<ListGraphType<UserLiteGraphType>>("usersWithPermission")
            .Argument<ListGraphType<EnumerationGraphType<Permission>>>("permissions")
            .ResolveAsync(async context =>
            {
                context.WithPermission(Permission.ViewUsers);

                var permissions = context.GetArgument<List<Permission>>("permissions");

                var users = await context.RequestServices!
                    .GetRequiredService<IUserRepository>()
                    .GetUsersWithPermissionsAsync(permissions.ToArray());

                return users;
            });

        Field<ListGraphType<UserLiteGraphType>>("usersByApprover")
            .Argument<NonNullGraphType<StringGraphType>>("username")
            .ResolveAsync(async context =>
            {
                var currentUsername = context.GetArgument<string>("username");
                var userRepository = context.RequestServices!.GetRequiredService<IUserRepository>();
                return await userRepository.GetUsersByApproverAsync(currentUsername);
            });
    }
}