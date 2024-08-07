using GraphQL.Types;
using Server.Models;

namespace Server.API.GraphTypes
{
    public class TimeStampGraphType : ObjectGraphType<TimeStamp>
    {
        public TimeStampGraphType() 
        {
            Name = "timeStamp";

            Field(ts => ts.Id);
            Field(ts => ts.Username);
            Field(ts => ts.TimeStart);
            Field(ts => ts.TimeEnd, nullable: true);
            Field(ts => ts.Source);
        }
    }
}
