using GraphQL;
using GraphQL.Types;
using Server.API.GraphTypes;
using Server.Authorization;
using Server.Data.Repositories;
using Server.Models;

namespace Server.API.Queries
{
    public class TimeStampQuery : ObjectGraphType
    {
        public TimeStampQuery() 
        {
            Field<TimeStampGraphType>("byId")
                .Argument<NonNullGraphType<IntGraphType>>("id")
                .ResolveAsync(async context =>
                {
                    context.Authorize();

                    var id = context.GetArgument<int>("id");

                    return await context.RequestServices!.GetRequiredService<ITimeStampRepository>().GetAsync(id)
                        ?? throw new ExecutionError("Time Stamp not found") { Code = ResponseCode.BadRequest };
                });

            Field<ResultSetGraphType<TimeStamp, TimeStampGraphType>>("byUsername")
                .Argument<NonNullGraphType<StringGraphType>>("username")
                .Argument<NonNullGraphType<IntGraphType>>("pageSize")
                .Argument<NonNullGraphType<IntGraphType>>("pageNumber")
                .ResolveAsync(async context =>
                {
                    context.Authorize();

                    var username = context.GetArgument<string>("username");
                    var pageSize = context.GetArgument<int>("pageSize");
                    var pageNumber = context.GetArgument<int>("pageNumber");

                    return await context.RequestServices!.GetRequiredService<ITimeStampRepository>().GetAsync(username, pageSize, pageNumber);
                });

            Field<TimeStampGraphType>("latest")
                .Argument<NonNullGraphType<StringGraphType>>("username")
                .ResolveAsync(async context =>
                {
                    context.Authorize();

                    var username = context.GetArgument<string>("username");

                    var res = await context.RequestServices!.GetRequiredService<ITimeStampRepository>().GetLatestAsync(username);
                    return res;
                });

            Field<ListGraphType<TimeStampGraphType>>("interval")
                .Argument<NonNullGraphType<DateTimeGraphType>>("dateStart")
                .Argument<NonNullGraphType<DateTimeGraphType>>("dateEnd")
                .Argument<NonNullGraphType<StringGraphType>>("username")
                .ResolveAsync(async context =>
                {
                    context.Authorize();

                    var username = context.GetArgument<string>("username");
                    var start = context.GetArgument<DateTime>("dateStart");
                    var end = context.GetArgument<DateTime>("dateEnd");

                    var res = await context.RequestServices!.GetRequiredService<ITimeStampRepository>().GetByInterval(start, end, username);

                    return res;
                });
        }
    }
}
