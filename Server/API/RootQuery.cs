using GraphQL.Types;
using Server.API.Queries;

namespace Server.API
{
    public class RootQuery : ObjectGraphType
    {
        public RootQuery()
        {
            Name = "query";

            Field<UserQuery>("user").Resolve(context => new { });
            Field<VacationQuery>("vacation").Resolve(context => new { });
            Field<TimeStampQuery>("timeStamp").Resolve(context => new { });
            Field<PlanQuery>("plan").Resolve(context => new { });
        }
    }
}
