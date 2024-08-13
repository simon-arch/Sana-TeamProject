using GraphQL;
using GraphQL.Types;
using Server.API.GraphInputTypes;
using Server.API.GraphTypes;
using Server.Authorization;
using Server.Data.Repositories;
using Server.Models;

namespace Server.API.Mutations
{
    public class TimeStampMutation : ObjectGraphType
    {
        public TimeStampMutation()
        {
            Field<TimeStampGraphType>("add")
                .Argument<NonNullGraphType<TimeStampInputGraphType>>("timeStamp")
                .ResolveAsync(async context =>
                {
                    context.Authorize();

                    var timeStamp = context.GetArgument<TimeStamp>("timeStamp");
                    var timeStampRepository = context.RequestServices!.GetRequiredService<ITimeStampRepository>();

                    _ = await context.RequestServices!.GetRequiredService<IUserRepository>().GetAsync(timeStamp.Username)
                        ?? throw new ExecutionError("User not found") { Code = ResponseCode.BadRequest };

                    var id = await timeStampRepository.InsertAsync(timeStamp);

                    return await timeStampRepository.GetAsync(id);
                });

            Field<BooleanGraphType>("remove")
                .Argument<NonNullGraphType<IntGraphType>>("id")
                .ResolveAsync(async context =>
                {
                    context.Authorize();

                    var id = context.GetArgument<int>("id");

                    var timeStampRepository = context.RequestServices!.GetRequiredService<ITimeStampRepository>();

                    _ = await timeStampRepository.GetAsync(id)
                        ?? throw new ExecutionError("Time stamp not found") { Code = ResponseCode.BadRequest };

                    await timeStampRepository.DeleteAsync(id);

                    return true;
                });

            Field<BooleanGraphType>("set_time")
                .Argument<NonNullGraphType<IntGraphType>>("id")
                .Argument<DateTimeGraphType>("timeStart")
                .Argument<DateTimeGraphType>("timeEnd")
                .ResolveAsync(async context =>
                {
                    context.Authorize();

                    var id = context.GetArgument<int>("id");
                    var timeStart = context.GetArgument<DateTime?>("timeStart");
                    var timeEnd = context.GetArgument<DateTime?>("timeEnd");

                    var timeStampRepository = context.RequestServices!.GetRequiredService<ITimeStampRepository>();
                    var timeStamp = await timeStampRepository.GetAsync(id)
                        ?? throw new ExecutionError("Time Stamp not found") { Code = ResponseCode.BadRequest };

                    if (timeStart != null) timeStamp.TimeStart = (DateTime)timeStart;
                    if (timeEnd != null) timeStamp.TimeEnd = (DateTime)timeEnd;

                    await timeStampRepository.UpdateAsync(timeStamp);

                    return true;
                });
        }
    }
}
