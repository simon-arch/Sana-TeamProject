using GraphQL;
using GraphQL.Types;
using Server.API.GraphTypes;
using Server.Authorization;
using Server.Data.Repositories;

namespace Server.API.Queries
{
    public class VacationQuery : ObjectGraphType
    {
        public VacationQuery()
        {
            Field<VacationGraphType>("byId")
                .Argument<NonNullGraphType<IntGraphType>>("id")
                .ResolveAsync(async context =>
                {
                    context.Authorize();
                    var id = context.GetArgument<int>("id");

                    return await context.RequestServices!.GetRequiredService<IVacationRepository>().GetAsync(id);
                });

            Field<ListGraphType<VacationGraphType>>("byUsername")
                .Argument<NonNullGraphType<StringGraphType>>("username")
                .ResolveAsync(async context =>
                {
                    context.Authorize();
                    var username = context.GetArgument<string>("username");

                    return await context.RequestServices!.GetRequiredService<IVacationRepository>().GetAsync(username);
                });

            Field<ListGraphType<VacationGraphType>>("vacations")
                .ResolveAsync(async context =>
                {
                    context.Authorize();

                    return await context.RequestServices!.GetRequiredService<IVacationRepository>().GetAllAsync();
                });
        }
    }
}
