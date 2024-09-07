using GraphQL.Types;
using Server.Models;

namespace Server.API.GraphTypes;

public sealed class UserLiteGraphType : ObjectGraphType<User>
{
    public UserLiteGraphType()
    {
        Field(u => u.Username);
        Field(u => u.FirstName);
        Field(u => u.LastName);
        Field(u => u.Role);
        Field(u => u.State);
    }
}