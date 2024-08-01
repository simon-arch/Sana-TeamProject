﻿using GraphQL.Types;
using Server.Models;

namespace Server.API.GraphInputTypes
{
    public class UserInputGraphType : InputObjectGraphType<User>
    {
        public UserInputGraphType()
        {
            Field(u => u.Username);
            Field("password", u => u.PasswordHash);
            Field(u => u.FirstName);
            Field(u => u.LastName);
            Field(u => u.Role);
            Field(u => u.Permissions);
        }
    }
}