using GraphQL;
using GraphQL.Types;
using Server.API.GraphInputTypes;
using Server.API.GraphTypes;
using Server.Authorization;
using Server.Data.Repositories;
using Server.Models;
using System.Security.Claims;
using Server.API.Mutations.Extensions;

namespace Server.API.Mutations;

public sealed class UserMutation : ObjectGraphType
{
    public UserMutation()
    {
        Field<UserGraphType>("add")
            .Argument<NonNullGraphType<UserInputGraphType>>("user")
            .ResolveAsync(async context =>
            {
                var logger = context.RequestServices!.GetRequiredService<ILogger<UserMutation>>();
                logger.LogInformation("Starting user creation process");

                context.WithPermission(Permission.RegisterUser);

                var user = context.GetArgument<User>("user");
                logger.LogInformation("Received user data: {@User}", user);

                var userRepository = context.RequestServices!.GetRequiredService<IUserRepository>();
                var duplicate = await userRepository.GetAsync(user.Username);

                if (duplicate != null)
                {
                    logger.LogWarning("User with this username already exists: {Username}", user.Username);
                    throw new ExecutionError("User with this username already exists")
                    {
                        Code = ResponseCode.BadRequest
                    };
                }

                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);
                logger.LogInformation("Password hashed for user: {Username}", user.Username);
                
                if (user.VacationApprovers != null)
                {
                    user.VacationApprovers.UserUsername = user.Username;
                    logger.LogInformation("Assigned UserUsername for VacationApprovers: {Username}", user.Username);
                }

                await userRepository.InsertAsync(user);
                logger.LogInformation("User successfully created: {Username}", user.Username);

                return user;
            });

        
        Field<UserGraphType>("delete")
            .Argument<NonNullGraphType<StringGraphType>>("username")
            .ResolveAsync(async context =>
            {
                var logger = context.RequestServices!.GetRequiredService<ILogger<UserMutation>>();
                logger.LogInformation("Starting user deletion process");

                context.WithPermission(Permission.DeleteUser);

                var username = context.GetArgument<string>("username");
                var repository = context.RequestServices!.GetRequiredService<IUserRepository>();
                var user = await repository.GetAsync(username);

                if (user == null)
                {
                    logger.LogWarning("User not found: {Username}", username);
                    throw new ExecutionError("User not found") { Code = ResponseCode.BadRequest };
                }

                await repository.DeleteAsync(user.Username);
                logger.LogInformation("User successfully deleted: {Username}", username);

                return user;
            });
        
        Field<UserGraphType>("update")
            .Argument<NonNullGraphType<UserUpdateInputGraphType>>("user")
            .ResolveAsync(async context =>
            {
                context.Authorize();

                var requestUser = context.GetArgument<User>("user");
                var repository = context.RequestServices!.GetRequiredService<IUserRepository>();
                var oldUser = await repository.GetAsync(requestUser.Username)
                              ?? throw new ExecutionError("User not found") { Code = ResponseCode.BadRequest };

                var username = context.User?.FindFirstValue(ClaimTypes.NameIdentifier);

                if (username == oldUser.Username)
                {
                    throw new ExecutionError("Cannot modify yourself")
                    {
                        Code = ResponseCode.BadRequest
                    };
                }
                
                if (oldUser.VacationApprovers != null)
                {
                    oldUser.VacationApprovers.UserUsername = requestUser.Username;
                }

                var newUser = new User
                {
                    Username = requestUser.Username,
                    PasswordHash = oldUser.PasswordHash,
                    TokenId = oldUser.TokenId,
                    FirstName = requestUser.FirstName,
                    LastName = requestUser.LastName,
                    Role = requestUser.Role,
                    Permissions = requestUser.Permissions,
                    State = oldUser.State,
                    WorkType = requestUser.WorkType,
                    WorkTime = requestUser.WorkTime,
                    VacationApprovers = new VacationApprovers
                    {
                        UserUsername = requestUser.Username,
                        ApprovedVacationsByUsers = requestUser.VacationApprovers?.ApprovedVacationsByUsers ?? []
                    }
                };

                await repository.UpdateAsync(newUser);
                return newUser;
            });

        Field<UserGraphType>("setState")
            .Argument<StringGraphType>("username")
            .Argument<EnumerationGraphType<State>>("state")
            .ResolveAsync(async context =>
            {
                context.Authorize();

                var username = context.GetArgument<string>("username");
                var state = context.GetArgument<State>("state");
                
                var repository = context.RequestServices!.GetRequiredService<IUserRepository>();
                
                var user = await repository.GetAsync(username)
                    ?? throw new ExecutionError("User not found") { Code = ResponseCode.BadRequest };
                
                user.State = state;
                await context.RequestServices!.GetRequiredService<IUserRepository>().UpdateAsync(user);

                return user;
            });
    }
}