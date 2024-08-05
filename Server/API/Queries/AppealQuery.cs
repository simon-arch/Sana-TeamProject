using GraphQL;
using GraphQL.Types;
using Server.API.GraphTypes;
using Server.Authorization;
using Server.Data.Repositories;

namespace Server.API.Queries
{
    public class AppealQuery : ObjectGraphType
    {
        public AppealQuery()
        {
            Field<AppealGraphType>("get_by_id")
                .Argument<IntGraphType>("id")
                .ResolveAsync(async context =>
                {
                    context.Authorize();
                    var id = context.GetArgument<int>("id");

                    return await context.RequestServices!.GetRequiredService<IAppealRepository>().GetAsync(id);
                });

            Field<ListGraphType<AppealGraphType>>("get_by_username")
                .Argument<StringGraphType>("username")
                .ResolveAsync(async context =>
                {
                    context.Authorize();
                    var username = context.GetArgument<string>("username");

                    return await context.RequestServices!.GetRequiredService<IAppealRepository>().GetAsync(username);
                });

            Field<ListGraphType<AppealGraphType>>("get_all")
                .ResolveAsync(async context =>
                {
                    context.Authorize();

                    return await context.RequestServices!.GetRequiredService<IAppealRepository>().GetAllAsync();
                });
        }
    }
}
