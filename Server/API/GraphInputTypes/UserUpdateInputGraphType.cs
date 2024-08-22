using GraphQL.Types;
using Server.Models;

namespace Server.API.GraphInputTypes;

public sealed class UserUpdateInputGraphType : InputObjectGraphType<User>
{
    public UserUpdateInputGraphType()
    {
        Field(u => u.Username);
        Field(u => u.FirstName);
        Field(u => u.LastName);
        Field(u => u.Role);
        Field(u => u.Permissions);
        Field(u => u.WorkType);
        Field(u => u.WorkTime, nullable: true);
    }
}