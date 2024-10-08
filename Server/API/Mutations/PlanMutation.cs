﻿using GraphQL;
using GraphQL.Types;
using Server.API.GraphInputTypes;
using Server.API.GraphTypes;
using Server.Authorization;
using Server.Data.Repositories;
using Server.Models;
using System.Security.Claims;

namespace Server.API.Mutations
{
    public class PlanMutation : ObjectGraphType
    {
        public PlanMutation()
        {
            Field<PlanGraphType>("add")
                .Argument<NonNullGraphType<PlanInputGraphType>>("plan")
                .ResolveAsync(async context =>
                {
                    context.Authorize();

                    var plan = context.GetArgument<Plan>("plan");
                    var planRepository = context.RequestServices!.GetRequiredService<IPlanRepository>();

                    _ = await context.RequestServices!.GetRequiredService<IUserRepository>().GetAsync(plan.Owner)
                        ?? throw new ExecutionError("User not found") { Code = ResponseCode.BadRequest };

                    var id = await planRepository.InsertAsync(plan);

                    return await planRepository.GetAsync(id);
                });

            Field<PlanGraphType>("remove")
                .Argument<NonNullGraphType<IntGraphType>>("id")
                .ResolveAsync(async context =>
                {
                    context.Authorize();

                    var id = context.GetArgument<int>("id");

                    var planRepository = context.RequestServices!.GetRequiredService<IPlanRepository>();

                    var plan = await planRepository.GetAsync(id)
                        ?? throw new ExecutionError("Plan not found") { Code = ResponseCode.BadRequest };

                    await planRepository.DeleteAsync(id);

                    return plan;
                });

            Field<PlanGraphType>("update")
                .Argument<NonNullGraphType<IntGraphType>>("id")
                .Argument<NonNullGraphType<DateTimeGraphType>>("timeStart")
                .Argument<NonNullGraphType<DateTimeGraphType>>("timeEnd")
                .ResolveAsync(async context =>
                {
                    context.Authorize();

                    var id = context.GetArgument<int>("id");
                    var timeStart = context.GetArgument<DateTime?>("timeStart");
                    var timeEnd = context.GetArgument<DateTime?>("timeEnd");
                    var title = context.GetArgument<string?>("title");
                    var description = context.GetArgument<string?>("description");

                    var planRepository = context.RequestServices!.GetRequiredService<IPlanRepository>();
                    var plan = await planRepository.GetAsync(id)
                        ?? throw new ExecutionError("Plan not found") { Code = ResponseCode.BadRequest };

                    if (timeStart != null)
                    {
                        plan.TimeStart = DateTime.SpecifyKind((DateTime)timeStart, DateTimeKind.Unspecified);
                    }
                    if (timeEnd != null)
                    {
                        plan.TimeEnd = DateTime.SpecifyKind((DateTime)timeEnd, DateTimeKind.Unspecified);
                    }

                    await planRepository.UpdateAsync(plan);

                    return plan;
                });
        }
    }
}
