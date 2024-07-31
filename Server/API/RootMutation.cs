using GraphQL.Types;
using Server.API.Mutations;

namespace Server.API
{
    public class RootMutation : ObjectGraphType
    {
        public RootMutation()
        {
            Name = "mutation";

            Field<AuthMutation>("auth").Resolve(context => new { });
            Field<UserMutation>("user").Resolve(context => new { });
        }
    }
}
