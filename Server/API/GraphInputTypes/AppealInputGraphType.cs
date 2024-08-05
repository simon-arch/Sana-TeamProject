using GraphQL.Types;
using Server.Models;

namespace Server.API.GraphInputTypes
{
    public class AppealInputGraphType : InputObjectGraphType<Appeal>
    {
        public AppealInputGraphType()
        {
            Field(a => a.Title);
            Field(a => a.Description, nullable: true);
            Field(a => a.Type);
            Field(a => a.Sender);
        }
    }
}
