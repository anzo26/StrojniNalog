using Microsoft.EntityFrameworkCore;
using StrojniNalog.Api.Bll;
using StrojniNalog.Api.Data;
using StrojniNalog.Api.Extensions;
using StrojniNalog.Api.Middleware;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException( "Povezava z bazo DefaultConnection ni nastavljena.");

builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString).UseSeeding((context, _) => DatabaseSeeder.Seed((AppDbContext)context)));
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.SnakeCaseUpper, allowIntegerValues: false));
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddKeycloakAuthentication(builder.Configuration, builder.Environment);
builder.Services.AddFrontendCors(builder.Configuration);

builder.Services.AddScoped<NarociloBll>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseRouting();
app.UseCors(CorsExtensions.FrontendPolicy);
app.UseAuthentication();
app.UseAuthorization();
app.UseMiddleware<UporabnikMiddleware>();
app.MapControllers();

app.MapGet("/", () => Results.Ok(new
{
    name = "StrojniNalog API",
    status = "Running"
}));

app.Run();
