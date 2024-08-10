using GraphQL.Types;
using Server.Models;

namespace Server.API.GraphInputTypes
{
    public class VacationInputGraphType : InputObjectGraphType<Vacation>
    {
        public VacationInputGraphType()
        {
            Field(a => a.Title);
            Field(a => a.Description, nullable: true);
            Field(a => a.Sender);
            Field(a => a.StartDate);
            Field(a => a.EndDate);
        }
    }
}
