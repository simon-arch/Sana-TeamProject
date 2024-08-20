using GraphQL.Types;
using Server.Models;

namespace Server.API.GraphInputTypes
{
    public class PlanInputGraphType : InputObjectGraphType<Plan>
    {
        public PlanInputGraphType() 
        {
            Field(p => p.Title);
            Field(p => p.Description, nullable: true);
            Field(p => p.TimeStart);
            Field(p => p.TimeEnd);
            Field(p => p.Owner);
        }
    }
}
