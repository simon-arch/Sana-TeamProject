using GraphQL;
using GraphQL.Types;
using Server.API.GraphTypes;
using Server.Authorization;
using Server.Data.Repositories;
using Server.Models;
using System.Collections.Generic;

namespace Server.API.Queries
{
    public class PlanQuery : ObjectGraphType
    {
        public PlanQuery() 
        {
            Field<PlanGraphType>("byId")
                .Argument<NonNullGraphType<IntGraphType>>("id")
                .ResolveAsync(async context =>
                {
                    context.Authorize();

                    var id = context.GetArgument<int>("id");

                    return await context.RequestServices!.GetRequiredService<IPlanRepository>().GetAsync(id)
                        ?? throw new ExecutionError("Plan not found") { Code = ResponseCode.BadRequest };
                });

            Field<ListGraphType<PlanGraphType>>("byUsernames")
                .Argument<NonNullGraphType<ListGraphType<StringGraphType>>>("usernames")
                .ResolveAsync(async context =>
                {
                    context.Authorize();

                    var usernames = context.GetArgument<string[]>("usernames");

                    return await context.RequestServices!.GetRequiredService<IPlanRepository>().GetAllAsync(usernames);
                });
        }
    }
}
