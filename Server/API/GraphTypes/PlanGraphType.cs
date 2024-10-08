﻿using GraphQL.Types;
using Server.Models;

namespace Server.API.GraphTypes
{
    public class PlanGraphType : ObjectGraphType<Plan>
    {
        public PlanGraphType() 
        {
            Field(p => p.Id);
            Field(p => p.TimeStart);
            Field(p => p.TimeEnd);
            Field(p => p.Owner);
        }
    }
}
