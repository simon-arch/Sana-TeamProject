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
        public AuthMutation(IHttpContextAccessor accessor)
        {
            Field<StringGraphType>("login")
                .Argument<StringGraphType>("username")
                .Argument<StringGraphType>("password")
                .ResolveAsync(async context =>
                {
                    var username = context.GetArgument<string>("username");
                    var password = context.GetArgument<string>("password");

                    var userRepository = context.RequestServices!.GetRequiredService<IUserRepository>();

                    var user = await userRepository.GetAsync(username);

                    if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                    {
                        context.Errors.Add(new("Wrong credentials."));
                        return string.Empty;                       
                    }

                    var tokenService = context.RequestServices!.GetRequiredService<TokenService>();

                    user.TokenId = tokenService.SetRefreshTokenToCookie(accessor.HttpContext!);
                    await userRepository.UpdateAsync(user);

                    return tokenService.GenerateAccessToken(user);
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

            Field<StringGraphType>("refresh")
                .ResolveAsync(async context =>
                {
                    var tokenService = context.RequestServices!.GetRequiredService<TokenService>();

                    var token = tokenService.GetRefreshTokenFromCookie(accessor.HttpContext!);

                    if (token == null)
                    {
                        context.Errors.Add(new("Required cookie was not found."));
                        return string.Empty;
                    }

                    var tokenId = tokenService.ValidateRefreshToken(token);

                    if (tokenId == null)
                    {
                        context.Errors.Add(new("Token was corrupted."));
                        return string.Empty;
                    }

                    var userRepository = context.RequestServices!.GetRequiredService<IUserRepository>();
                    var user = await userRepository.GetAsync((Guid)tokenId);

                    if (user == null)
                    {
                        return string.Empty;
                    }

                    user.TokenId = tokenService.SetRefreshTokenToCookie(accessor.HttpContext!);
                    await userRepository.UpdateAsync(user);

                    return tokenService.GenerateAccessToken(user);
                });

            Field<StringGraphType>("logout")
                .ResolveAsync(async context =>
                {
                    var tokenService = context.RequestServices!.GetRequiredService<TokenService>();

                    var token = tokenService.GetRefreshTokenFromCookie(accessor.HttpContext!);

                    if (token == null)
                    {
                        context.Errors.Add(new("Required cookie was not found."));
                        return string.Empty;
                    }

                    var tokenId = tokenService.ValidateRefreshToken(token);

                    if (tokenId == null)
                    {
                        context.Errors.Add(new("Token was corrupted."));
                        return string.Empty;
                    }

                    var userRepository = context.RequestServices!.GetRequiredService<IUserRepository>();
                    var user = await userRepository.GetAsync((Guid)tokenId);

                    if (user == null)
                    {
                        return string.Empty;
                    }

                    user.TokenId = null;
                    await userRepository.UpdateAsync(user);

                    tokenService.DeleteRefreshTokenFromCookie(accessor.HttpContext!);

                    return "Success.";
                });
        }
    }
}
