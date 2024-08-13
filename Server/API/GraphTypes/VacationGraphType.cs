using GraphQL.Types;
using Server.Models;

namespace Server.API.GraphTypes
{
    public class VacationGraphType : ObjectGraphType<Vacation>
    {
        public VacationGraphType() 
        {
            Field(a => a.Id);
            Field(a => a.Title);
            Field(a => a.Description, nullable: true);
            Field(a => a.Status);
            Field(a => a.Sender);
            Field(a => a.StartDate);
            Field(a => a.EndDate);
        }
    }
}
