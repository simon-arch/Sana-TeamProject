using GraphQL.Types;
using Server.Models;

namespace Server.API.GraphTypes;

public sealed class VacationApproversGraphType : ObjectGraphType<VacationApprovers>
{
    public VacationApproversGraphType()
    {
        Field<ListGraphType<StringGraphType>>("approvedVacationsByUsers")
            .Resolve(context => context.Source.ApprovedVacationsByUsers);
    }
}