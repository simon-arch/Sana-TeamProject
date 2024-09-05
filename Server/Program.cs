using Dapper;
using GraphQL;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Server.API;
using Server.Authorization;
using Server.Data;
using Server.Data.Helpers;
using Server.Data.Repositories;
using Server.Services;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddHttpContextAccessor();

        builder.Services.AddSingleton<TokenService>();
        builder.Services.AddHostedService<MidnightCleanupService>();
        builder.Services.AddHostedService<TimeStampAutoStopService>();

        builder.Services.AddSingleton<DbProvider>();

        SqlMapper.AddTypeHandler(typeof(Permission[]), new JsonTypeHandler());

        SqlMapper.AddTypeHandler(typeof(Guid), new GuidTypeHandler());
        SqlMapper.RemoveTypeMap(typeof(Guid));
        
        SqlMapper.AddTypeHandler(typeof(List<string>), new JsonTypeHandler());

        builder.Services.AddScoped<IUserRepository, UserRepository>();
        builder.Services.AddScoped<IVacationRepository, VacationRepository>();
        builder.Services.AddScoped<ITimeStampRepository, TimeStampRepository>();
        builder.Services.AddScoped<IPlanRepository, PlanRepository>();

        builder.Services.AddCors(options => options
            .AddDefaultPolicy(policy => policy
                .WithOrigins("https://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials()
            )
        );

        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
                options.TokenValidationParameters = TokenService.GetValidationParameters(builder.Configuration));

        builder.Services.AddGraphQL(builder => builder
            .AddSystemTextJson()
            .AddSelfActivatingSchema<RootSchema>());

        var app = builder.Build();

        app.UseRouting();
        app.UseCors();
        app.UseAuthentication();
        app.UseGraphQL("/api", options =>
        {
            options.ValidationErrorsReturnBadRequest = false;
        });

        app.Run();
    }
}