using GraphQL;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
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
            foreach (Permission permission in Enum.GetValues<Permission>())
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

        app.MapGet("/login", async (HttpContext ctx) =>
        {
            // Disable caching
            ctx.Response.Headers["Cache-Control"] = "no-store, no-cache, must-revalidate, proxy-revalidate";
            ctx.Response.Headers["Pragma"] = "no-cache";
            ctx.Response.Headers["Expires"] = "0";
    
            string? usrn = ctx.Request.Query["usrn"];
            string? psw = ctx.Request.Query["psw"];

            User? user = InMemoryStorage.Authenticate(usrn, psw);

            if (user == null)
            {
                ctx.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await ctx.Response.WriteAsync("Invalid username or password");
                return;
            }

            Claim[] claims = { new Claim(ClaimTypes.Role, user.Role) };

            await ctx.SignInAsync(new ClaimsPrincipal(
                new ClaimsIdentity(claims, "cookie")
            ));
            
            // Backend response
            var response = new
            {
                UserNane = user.Username,
                UserRole = user.Role,
                Permissions = InMemoryStorage.GetPermissionsForRole(user.Role)
            };

            ctx.Response.StatusCode = StatusCodes.Status200OK;
            ctx.Response.ContentType = "application/json";
            await ctx.Response.WriteAsJsonAsync(response);
        });
        
        app.MapGet("/role", (HttpContext ctx) =>
        {
            string? role = ctx.User.FindFirst(ClaimTypes.Role)?.Value;
            return role ?? "no role";
        });
        
        app.MapGet("/users", () => { return InMemoryStorage.GetUsers(); });

        app.MapGet("/roles", () => { return InMemoryStorage.GetRoles(); });
        app.MapGet("/userroles", () => { return InMemoryStorage.GetUserRoles(); });

        app.MapGet("/", () => "");
        app.MapGet("/vu", () => "allowed to view users").RequireAuthorization(Permission.ViewUsers.ToString());
        app.MapGet("/mu", () => "allowed to manage users").RequireAuthorization(Permission.ManageUsers.ToString());

        app.Run();
    }
}
