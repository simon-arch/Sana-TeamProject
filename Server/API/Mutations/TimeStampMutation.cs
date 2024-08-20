using GraphQL;
using GraphQL.Types;
using Server.API.GraphInputTypes;
using Server.API.GraphTypes;
using Server.Authorization;
using Server.Data.Repositories;
using Server.Models;
using System.Security.Claims;

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

                    var latest = await timeStampRepository.GetLatestAsync(timeStamp.Username);

                    if (latest != null && latest.TimeEnd != null &&
                        timeStamp.Source == Source.TIMER && (timeStamp.TimeStart - latest.TimeEnd).Value.TotalMinutes < 1)
                    {
                        latest.TimeEnd = null;
                        await timeStampRepository.UpdateAsync(latest);

                        return latest;
                    }

                    var id = await timeStampRepository.InsertAsync(timeStamp);
                    return await timeStampRepository.GetAsync(id);
                });

            Field<TimeStampGraphType>("remove")
                .Argument<NonNullGraphType<IntGraphType>>("id")
                .ResolveAsync(async context =>
                {
                    context.Authorize();

                    var id = context.GetArgument<int>("id");

                    var timeStampRepository = context.RequestServices!.GetRequiredService<ITimeStampRepository>();

                    var timeStamp = await timeStampRepository.GetAsync(id)
                        ?? throw new ExecutionError("Time stamp not found") { Code = ResponseCode.BadRequest };

                    await timeStampRepository.DeleteAsync(id);

                    return timeStamp;
                });

            Field<TimeStampGraphType>("update")
                .Argument<NonNullGraphType<IntGraphType>>("id")
                .Argument<DateTimeGraphType>("timeStart")
                .Argument<DateTimeGraphType>("timeEnd")
                .Argument<StringGraphType>("editor")
                .ResolveAsync(async context =>
                {
                    context.Authorize();

                    var id = context.GetArgument<int>("id");
                    var timeStart = context.GetArgument<DateTime?>("timeStart");
                    var timeEnd = context.GetArgument<DateTime?>("timeEnd");
                    var username = context.GetArgument<string?>("editor");

                    var timeStampRepository = context.RequestServices!.GetRequiredService<ITimeStampRepository>();
                    var timeStamp = await timeStampRepository.GetAsync(id)
                        ?? throw new ExecutionError("Time Stamp not found") { Code = ResponseCode.BadRequest };

                    if (timeStart != null)
                    {
                        timeStamp.TimeStart = DateTime.SpecifyKind((DateTime)timeStart, DateTimeKind.Unspecified);
                    }
                    if (timeEnd != null)
                    {
                        timeStamp.TimeEnd = DateTime.SpecifyKind((DateTime)timeEnd, DateTimeKind.Unspecified);
                    }
                    if (username != null) {
                        timeStamp.Editor = username;
                        timeStamp.Source = Source.USER;
                    }

                    await timeStampRepository.UpdateAsync(timeStamp);

                    return timeStamp;
                });
        }
    }
}
