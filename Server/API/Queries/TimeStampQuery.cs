using GraphQL;
using GraphQL.Types;
using Server.API.GraphTypes;
using Server.Authorization;
using Server.Data.Repositories;

namespace Server.API.Queries
{
    public class TimeStampQuery : ObjectGraphType
    {
        public TimeStampQuery() 
        {
            Field<TimeStampGraphType>("get_by_id")
                .Argument<NonNullGraphType<IntGraphType>>("id")
                .ResolveAsync(async context =>
                {
                    context.Authorize();

                    var id = context.GetArgument<int>("id");

                    return await context.RequestServices!.GetRequiredService<ITimeStampRepository>().GetAsync(id)
                        ?? throw new ExecutionError("Time Stamp not found") { Code = ResponseCode.BadRequest };
                });

            Field<ListGraphType<TimeStampGraphType>>("get_by_username")
                .Argument<NonNullGraphType<StringGraphType>>("username")
                .ResolveAsync(async context =>
                {
                    context.Authorize();

                    var username = context.GetArgument<string>("username");

                    return await context.RequestServices!.GetRequiredService<ITimeStampRepository>().GetAsync(username);
                });

            Field<TimeStampGraphType>("get_latest")
                .Argument<NonNullGraphType<StringGraphType>>("username")
                .ResolveAsync(async context =>
                {
                    context.Authorize();

                    var username = context.GetArgument<string>("username");

                    var res = await context.RequestServices!.GetRequiredService<ITimeStampRepository>().GetLatestAsync(username);
                    return res;
                });
        }
    }
}
