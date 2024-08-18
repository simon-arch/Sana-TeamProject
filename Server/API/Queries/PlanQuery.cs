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
            Field<PlanGraphType>("get_by_id")
                .Argument<NonNullGraphType<IntGraphType>>("id")
                .ResolveAsync(async context =>
                {
                    context.Authorize();

                    var id = context.GetArgument<int>("id");

                    return await context.RequestServices!.GetRequiredService<IPlanRepository>().GetAsync(id)
                        ?? throw new ExecutionError("Plan not found") { Code = ResponseCode.BadRequest };
                });

            Field<ListGraphType<PlanGraphType>>("get_by_usernames")
                .Argument<NonNullGraphType<ListGraphType<StringGraphType>>>("usernames")
                .ResolveAsync(async context =>
                {
                    context.Authorize();

                    var usernames = context.GetArgument<List<string>>("usernames");
                    var plans = new List<Plan>();

                    var planRepository = context.RequestServices!.GetRequiredService<IPlanRepository>();

                    foreach (var username in usernames)
                    {
                        var userPlans = await planRepository.GetAsync(username);
                        plans.AddRange(userPlans);
                    }

                    return plans;
                });
        }
    }
}
