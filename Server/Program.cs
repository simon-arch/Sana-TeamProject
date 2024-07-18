using GraphQL;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddCors(options => options
            .AddDefaultPolicy(policy => policy
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .WithOrigins("http://localhost:5173")
                    )
            );

        builder.Services.AddAuthentication()
            .AddCookie();
        builder.Services.AddAuthorization(option => { });

        builder.Services.AddGraphQL(builder => builder
            //.AddSchema<>()
            .AddSystemTextJson()
            .AddAuthorization(option => { }));

        var app = builder.Build();

        app.UseCors();

        app.UseGraphQL();

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapGet("/", () => "Hello, from server");

        app.Run();
    }
}