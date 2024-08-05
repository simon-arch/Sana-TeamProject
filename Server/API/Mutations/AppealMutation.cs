using GraphQL;
using GraphQL.Types;
using Server.API.GraphInputTypes;
using Server.API.GraphTypes;
using Server.Authorization;
using Server.Data.Repositories;
using Server.Models;

namespace Server.API.Mutations
{
    public class AppealMutation : ObjectGraphType
    {
        public AppealMutation() 
        {
            Field<AppealGraphType>("add")
                .Argument<AppealInputGraphType>("appeal")
                .ResolveAsync(async context =>
                {
                    context.Authorize();
                    
                    var appeal = context.GetArgument<Appeal>("appeal");
                    var appealRepository = context.RequestServices!.GetRequiredService<IAppealRepository>();

                    var id = await appealRepository.InsertAsync(appeal);

                    return await appealRepository.GetAsync(id);
                });

            Field<BooleanGraphType>("remove")
                .Argument<IntGraphType>("id")
                .ResolveAsync(async context =>
                {
                    context.Authorize();
                    
                    var id = context.GetArgument<int>("id");

                    await context.RequestServices!.GetRequiredService<IAppealRepository>().DeleteAsync(id);

                    return true;
                });

            Field<AppealGraphType>("set_status")
                .Argument<IntGraphType>("id")
                .Argument<EnumerationGraphType<Status>>("status")
                .ResolveAsync(async context =>
                {
                    context.Authorize();

                    var id = context.GetArgument<int>("id");
                    var status = context.GetArgument<Status>("status");
                    var appealRepository = context.RequestServices!.GetRequiredService<IAppealRepository>();

                    var appeal = await appealRepository.GetAsync(id)
                        ?? throw new ExecutionError("Appeal not found") { Code = ResponseCode.BadRequest };

                    appeal.Status = status;
                    await context.RequestServices!.GetRequiredService<IAppealRepository>().UpdateAsync(appeal);

                    return appeal;
                });
        }
    }
}
