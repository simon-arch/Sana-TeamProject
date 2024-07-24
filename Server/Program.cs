using Server.Authorization;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        
        builder.Services.AddCors(options => options
            .AddDefaultPolicy(policy => policy
                .WithOrigins("https://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials()
            )
        );

        builder.Services.AddAuthentication("cookie")
            .AddCookie("cookie", options =>
            {
                options.Cookie.HttpOnly = true;
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;

                options.Events.OnRedirectToLogin = context =>
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    return Task.CompletedTask;
                };
            });
        
        builder.Services.AddAuthorization(options =>
        {
            foreach (var permission in Enum.GetValues<Permission>())
            {
                options.AddPolicy(permission.ToString(), policy =>
                    policy.RequireAssertion(context => context.User.HasPermission(permission)));
            }
        });

        builder.Services.AddControllers();

        var app = builder.Build();

        app.UseCors();

        app.UseHttpsRedirection();
        app.UseRouting();

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}
