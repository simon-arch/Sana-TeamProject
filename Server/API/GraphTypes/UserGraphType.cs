using GraphQL.Types;
using Server.Models;

namespace Server.API.GraphTypes;

public sealed class UserGraphType : ObjectGraphType<User>
{
    public UserGraphType()
    {
        Name = "user";

        Field(u => u.Username);
        Field(u => u.FirstName);
        Field(u => u.LastName);
        Field(u => u.Role);
        Field(u => u.Permissions);
        Field(u => u.State);
    }
}