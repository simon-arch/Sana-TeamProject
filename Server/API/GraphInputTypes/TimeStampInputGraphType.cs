using GraphQL.Types;
using Server.Models;

namespace Server.API.GraphInputTypes
{
    public class TimeStampInputGraphType : InputObjectGraphType<TimeStamp>
    {
        public TimeStampInputGraphType() 
        {
            Field(ts => ts.Username);
            Field(ts => ts.TimeStart);
            Field(ts => ts.TimeEnd, nullable: true);
            Field(ts => ts.Source);
        }
    }
}
