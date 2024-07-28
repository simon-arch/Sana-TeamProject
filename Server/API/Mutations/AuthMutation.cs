using GraphQL;
using GraphQL.Types;
using Server.API.GraphInputTypes;
using Server.API.Types;
using Server.Data.Repositories;
using Server.Models;
using Server.Services;

namespace Server.API.Mutations
{
    public class AuthMutation : ObjectGraphType
    {
        public AuthMutation()
        {
            Field<StringGraphType>("login")
                .Argument<StringGraphType>("username")
                .Argument<StringGraphType>("password")
                .ResolveAsync(async context =>
                {
                    var username = context.GetArgument<string>("username");
                    var password = context.GetArgument<string>("password");

                    var user = await context.RequestServices!.GetRequiredService<IUserRepository>().GetAsync(username);

                    if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                    {
                        context.Errors.Add(new("Wrong credentials."));
                        return string.Empty;                       
                    }

                    return context.RequestServices!.GetRequiredService<TokenService>().CreateToken(user);
                });

            Field<UserGraphType>("register")
                .Argument<UserInputGraphType>("user")
                .ResolveAsync(async context =>
                {
                    var user = context.GetArgument<User>("user");

                    user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);
                    user.Id = await context.RequestServices!.GetRequiredService<IUserRepository>().InsertAsync(user);

                    return user;
                });
        }
    }
}
