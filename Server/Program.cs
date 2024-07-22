using GraphQL;
using Microsoft.AspNetCore.Authentication;
using Server.Authorization;
using Server.Data;
using Server.Models;
using System.Security.Claims;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddCors(options => options
            .AddDefaultPolicy(policy => policy
                .WithOrigins("http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials()
            )
        );

        builder.Services.AddAuthentication()
            .AddCookie("cookie");
        builder.Services.AddAuthorization(options =>
        {
            foreach(Permission permission in Enum.GetValues<Permission>())
            {
                options.AddPolicy(permission.ToString(), policy =>
                    policy.RequireAssertion(context => context.User.HasPermission(permission)));
            }
        });

        builder.Services.AddGraphQL(builder => builder
            //.AddSchema<>()
            .AddSystemTextJson()
            .AddAuthorization(option => { }));

        var app = builder.Build();

        app.UseCors();

        app.UseGraphQL();

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapGet("/login", (HttpContext ctx) => {

            string? usrn = ctx.Request.Query["usrn"];
            string? psw = ctx.Request.Query["psw"];

            User? user = InMemoryStorage.Authenticate(usrn, psw);

            if (user == null)
            {
                return;
            }

            Claim[] claims = [new Claim(ClaimTypes.Role, user.Role)];

            ctx.SignInAsync(new ClaimsPrincipal(
                new ClaimsIdentity(claims, "cookie")
            ));
        });

        app.MapGet("/role", (HttpContext ctx) =>
        {
            string? role = ctx.User.FindFirst(ClaimTypes.Role)?.Value;
            return role ?? "no role";
        });

        app.MapGet("/roles", () => { return InMemoryStorage.GetRoles(); });
        app.MapGet("/userroles", () => { return InMemoryStorage.GetUserRoles(); });

        app.MapGet("/", () => "");
        app.MapGet("/vu", () => "allowed to view users").RequireAuthorization(Permission.ViewUsers.ToString());
        app.MapGet("/mu", () => "allowed to manage users").RequireAuthorization(Permission.ManageUsers.ToString());

        app.Run();
    }
}