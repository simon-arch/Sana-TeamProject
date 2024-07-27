using GraphQL.Types;
using Server.Authorization;

namespace Server.API.Queries
{
    public class AuthQuery : ObjectGraphType
    {
        public AuthQuery()
        {
            Field<ListGraphType<EnumerationGraphType<Role>>>("roles")
                .Resolve(context => Enum.GetValues(typeof(Role)));

            Field<ListGraphType<EnumerationGraphType<Permission>>>("permissions")
                .Resolve(context => Enum.GetValues(typeof(Permission)));
        }
    }
}
