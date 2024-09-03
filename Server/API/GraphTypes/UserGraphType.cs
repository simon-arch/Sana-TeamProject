using GraphQL.Types;
using Server.Models;

namespace Server.API.GraphTypes;

public sealed class UserGraphType : ObjectGraphType<User>
{
    public UserGraphType()
    {
        Field(u => u.Username);
        Field(u => u.FirstName);
        Field(u => u.LastName);
        Field(u => u.Role);
        Field(u => u.Permissions);
        Field(u => u.State);
        Field(u => u.WorkType);
        Field(u => u.WorkTime, nullable: true);
        Field<VacationApproversGraphType>("vacationApprovers").Resolve(context => context.Source.VacationApprovers);
    }
}