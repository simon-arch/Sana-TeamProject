using Dapper;
using GraphQL;
using GraphQL.MicrosoftDI;
using GraphQL.Types;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Server.API;
using Server.Authorization;
using Server.Data;
using Server.Data.Helpers;
using Server.Data.Repositories;
using Server.Services;
using System.Text;
using GraphQL.Server.Ui.Altair;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddSingleton<TokenService>();

        builder.Services.AddSingleton<DbProvider>();
        SqlMapper.AddTypeHandler(typeof(Permission[]), new JsonTypeHandler());

        builder.Services.AddScoped<IUserRepository, UserRepository>();

        builder.Services.AddSingleton<ISchema ,RootSchema>(services => new(new SelfActivatingServiceProvider(services)));

        builder.Services.AddCors(options => options
            .AddDefaultPolicy(policy => policy
                .WithOrigins("https://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod()
            )
        );

        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!);
                options.TokenValidationParameters = new()
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(key)
                };
            });

        builder.Services.AddGraphQL(builder => builder
            .AddSystemTextJson()
            .AddAuthorization(settings =>
            {
                foreach (Permission permission in Enum.GetValues(typeof(Permission)))
                {
                    settings.AddPolicy(permission.ToString(), policy =>
                        policy.RequireClaim("permissions", permission.ToString()));
                }
            }));

        var app = builder.Build();
        
        using (var scope = app.Services.CreateScope())
        {
            var dbProvider = scope.ServiceProvider.GetRequiredService<DbProvider>();
        }

        app.UseRouting();
        app.UseCors();
        app.UseAuthentication();
        app.UseGraphQL();
        app.UseGraphQLAltair(new AltairOptions().GraphQLEndPoint = "/altair");

        app.Run();
    }
}
