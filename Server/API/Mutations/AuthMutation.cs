﻿using GraphQL;
using GraphQL.Types;
using Server.API.GraphInputTypes;
using Server.API.Types;
using Server.Authorization;
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
                        throw new ExecutionError("Wrong credentials") { Code = ResponseCode.Unauthorized };
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
                    await userRepository.InsertAsync(user);

                    return user;
                });

            Field<ListGraphType<StringGraphType>>("refresh")
                .ResolveAsync(async context =>
                {
                    var tokenService = context.RequestServices!.GetRequiredService<TokenService>();

                    var token = tokenService.GetRefreshTokenFromCookie(accessor.HttpContext!)
                        ?? throw new ExecutionError("Token not found") { Code = ResponseCode.BadRequest };

                    var tokenId = tokenService.ValidateRefreshToken(token)
                        ?? throw new ExecutionError("Token was corrupted") { Code = ResponseCode.BadRequest };

                    var userRepository = context.RequestServices!.GetRequiredService<IUserRepository>();
                    var user = await userRepository.GetAsync(tokenId) 
                        ?? throw new ExecutionError("Invalid Token") { Code = ResponseCode.Unauthorized };

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
}