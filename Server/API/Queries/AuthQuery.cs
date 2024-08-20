using GraphQL.Types;
using Server.Authorization;
using Server.Models;

namespace Server.API.Queries;

public sealed class AuthQuery : ObjectGraphType
{
    public AuthQuery()
    {
        Field<ListGraphType<EnumerationGraphType<Role>>>("roles")
            .Resolve(context =>
            {
                context.Authorize();

                return Enum.GetValues(typeof(Role));
            });

        Field<ListGraphType<EnumerationGraphType<Permission>>>("permissions")
            .Resolve(context =>
            {
                context.Authorize();

                return Enum.GetValues(typeof(Permission));
            });
        Field<ListGraphType<EnumerationGraphType<WorkType>>>("workTypes")
            .Resolve(context =>
            {
                context.Authorize();

                return Enum.GetValues(typeof(WorkType));
            });
    }
}