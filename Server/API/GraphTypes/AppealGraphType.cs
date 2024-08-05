using GraphQL.Types;
using Server.Models;

namespace Server.API.GraphTypes
{
    public class AppealGraphType : ObjectGraphType<Appeal>
    {
        public AppealGraphType() 
        {
            Name = "appeal";

            Field(a => a.Id);
            Field(a => a.Title);
            Field(a => a.Description, nullable: true);
            Field(a => a.Type);
            Field(a => a.Status);
            Field(a => a.Sender);
        }
    }
}
