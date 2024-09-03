using GraphQL.Types;
using Server.Models;

namespace Server.API.GraphInputTypes;

public sealed class UserInputGraphType : InputObjectGraphType<User>
{
    public UserInputGraphType()
    {
        Field(u => u.Username);
        Field("password", u => u.PasswordHash);
        Field(u => u.FirstName);
        Field(u => u.LastName);
        Field(u => u.Role);
        Field(u => u.Permissions);
        Field(u => u.State);
        Field(u => u.WorkType);
        Field(u => u.WorkTime, nullable: true);
        Field<VacationApproversInputGraphType>("vacationApprovers");
    }
}