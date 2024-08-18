using GraphQL.Types;
using Server.Models;

namespace Server.API.GraphTypes
{
    public class PlanGraphType : ObjectGraphType<Plan>
    {
        public PlanGraphType() 
        {
            Field(p => p.Id);
            Field(p => p.Title);
            Field(p => p.Description, nullable: true);
            Field(p => p.TimeStart);
            Field(p => p.TimeEnd, nullable: true);
            Field(p => p.Owner);
        }
    }
}
