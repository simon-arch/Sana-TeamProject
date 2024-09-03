using GraphQL.Types;
using Server.Models;

namespace Server.API.GraphInputTypes;

public sealed class VacationApproversInputGraphType : InputObjectGraphType<VacationApprovers>
{
    public VacationApproversInputGraphType()
    {
        Field<ListGraphType<StringGraphType>>("approvedVacationsByUsers");
    }
}