using GraphQL;
using GraphQL.Types;
using Server.API.GraphInputTypes;
using Server.API.GraphTypes;
using Server.Authorization;
using Server.Data.Repositories;
using Server.Models;

namespace Server.API.Mutations
{
    public class VacationMutation : ObjectGraphType
    {
        public VacationMutation() 
        {
            Field<VacationGraphType>("add")
                .Argument<NonNullGraphType<VacationInputGraphType>>("vacation")
                .ResolveAsync(async context =>
                {
                    context.Authorize();
                    
                    var vacation = context.GetArgument<Vacation>("vacation");
                    var vacationRepository = context.RequestServices!.GetRequiredService<IVacationRepository>();

                    var id = await vacationRepository.InsertAsync(vacation);

                    return await vacationRepository.GetAsync(id);
                });

            Field<BooleanGraphType>("remove")
                .Argument<NonNullGraphType<IntGraphType>>("id")
                .ResolveAsync(async context =>
                {
                    context.Authorize();
                    
                    var id = context.GetArgument<int>("id");

                    await context.RequestServices!.GetRequiredService<IVacationRepository>().DeleteAsync(id);

                    return true;
                });

            Field<VacationGraphType>("set_status")
                .Argument<NonNullGraphType<IntGraphType>>("id")
                .Argument<NonNullGraphType<EnumerationGraphType<Status>>>("status")
                .ResolveAsync(async context =>
                {
                    context.Authorize();

                    var id = context.GetArgument<int>("id");
                    var status = context.GetArgument<Status>("status");
                    var vacationRepository = context.RequestServices!.GetRequiredService<IVacationRepository>();

                    var vacation = await vacationRepository.GetAsync(id)
                        ?? throw new ExecutionError("Appeal not found") { Code = ResponseCode.BadRequest };

                    vacation.Status = status;
                    await context.RequestServices!.GetRequiredService<IVacationRepository>().UpdateAsync(vacation);

                    return vacation;
                });
        }
    }
}
