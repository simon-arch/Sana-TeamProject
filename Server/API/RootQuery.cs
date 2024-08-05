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
            Field<AuthQuery>("auth").Resolve(context => new { });
            Field<AppealQuery>("appeal").Resolve(context => new { });
        }
    }
}
