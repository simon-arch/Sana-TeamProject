using GraphQL;
using GraphQL.Types;
using Server.API.GraphInputTypes;
using Server.API.GraphTypes;
using Server.Authorization;
using Server.Data.Repositories;
using Server.Models;
using Server.Services;

namespace Server.API.Mutations;

public sealed class AuthMutation : ObjectGraphType
{
    public AuthMutation(IHttpContextAccessor accessor)
    {
        Field<StringGraphType>("login")
            .Argument<NonNullGraphType<StringGraphType>>("username")
            .Argument<NonNullGraphType<StringGraphType>>("password")
            .ResolveAsync(async context =>
            {
                var username = context.GetArgument<string>("username");
                var password = context.GetArgument<string>("password");

                var userRepository = context.RequestServices!.GetRequiredService<IUserRepository>();

                var user = await userRepository.GetAsync(username);

                if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                {
                    throw new ExecutionError("Wrong credentials") { Code = ResponseCode.Unauthorized };
                }
                
                if (user.State == State.Fired)
                {
                    throw new ExecutionError("User is fired") { Code = ResponseCode.Fired };
                }

                var tokenService = context.RequestServices!.GetRequiredService<TokenService>();

                user.TokenId = tokenService.SetRefreshTokenToCookie(accessor.HttpContext!);
                await userRepository.UpdateAsync(user);

                return tokenService.GenerateAccessToken(user);
            });

        Field<UserGraphType>("register")
            .Argument<NonNullGraphType<UserInputGraphType>>("user")
            .ResolveAsync(async context =>
            {
                context.WithPermission(Permission.REGISTER_USER);

                var user = context.GetArgument<User>("user");
                var userRepository = context.RequestServices!.GetRequiredService<IUserRepository>();
                var duplicate = await userRepository.GetAsync(user.Username);

                if (duplicate != null)
                {
                    throw new ExecutionError("User with this username already exists")
                    {
                        Code = ResponseCode.BadRequest
                    };
                }

                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);
                await context.RequestServices!.GetRequiredService<IUserRepository>().InsertAsync(user);
                
                var usersToUpdate = user.VacationsApprovedByUsers;

                foreach (var username in usersToUpdate)
                {
                    var approvingUser = await userRepository.GetAsync(username);
                    if (approvingUser == null) continue;

                    if (approvingUser.ApproveVacationsForUsers.Contains(user.Username)) continue;
                    approvingUser.ApproveVacationsForUsers = approvingUser.ApproveVacationsForUsers.Concat(new[] { user.Username }).ToList();
                    await userRepository.UpdateAsync(approvingUser);
                }
                
                return user;
            });

        Field<StringGraphType>("refresh")
            .ResolveAsync(async context =>
            {
                var tokenService = context.RequestServices!.GetRequiredService<TokenService>();

                var token = tokenService.GetRefreshTokenFromCookie(accessor.HttpContext!)
                            ?? throw new ExecutionError("Token not found") { Code = ResponseCode.BadRequest };

                var tokenId = tokenService.ValidateRefreshToken(token)
                              ?? throw new ExecutionError("Token was corrupted") { Code = ResponseCode.BadRequest };

                var userRepository = context.RequestServices!.GetRequiredService<IUserRepository>();
                var user = await userRepository.GetAsync(tokenId)
                           ?? throw new ExecutionError("Invalid Token") { Code = ResponseCode.BadRequest };

                user.TokenId = tokenService.SetRefreshTokenToCookie(accessor.HttpContext!);
                await userRepository.UpdateAsync(user);

                return tokenService.GenerateAccessToken(user);
            });

        Field<BooleanGraphType>("logout")
            .ResolveAsync(async context =>
            {
                var tokenService = context.RequestServices!.GetRequiredService<TokenService>();

                var token = tokenService.GetRefreshTokenFromCookie(accessor.HttpContext!)
                            ?? throw new ExecutionError("Token not found") { Code = ResponseCode.BadRequest };

                var tokenId = tokenService.ValidateRefreshToken(token)
                              ?? throw new ExecutionError("Token was corrupted") { Code = ResponseCode.BadRequest };

                var userRepository = context.RequestServices!.GetRequiredService<IUserRepository>();
                var user = await userRepository.GetAsync(tokenId)
                           ?? throw new ExecutionError("Invalid token") { Code = ResponseCode.Unauthorized };

                user.TokenId = null;
                await userRepository.UpdateAsync(user);

                return true;
            });
    }
}