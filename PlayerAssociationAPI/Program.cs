using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using PlayerAssociationAPI.Data;
using PlayerAssociationAPI.Services.Interfaces;
using PlayerAssociationAPI.Services.Implementations;

var builder = WebApplication.CreateBuilder(args);

// ----------------------
// Add Services
// ----------------------

// Add Controllers
builder.Services.AddControllers();

// Add EF Core DbContext with SQL Server & Lazy Loading
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
           .UseLazyLoadingProxies()
);

// Enable CORS for Frontend Integration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .AllowAnyOrigin();
    });
});

// Register Services (Dependency Injection)
builder.Services.AddScoped<IPlayerService, PlayerService>();
builder.Services.AddScoped<IEventService, EventService>();
builder.Services.AddScoped<IInsightService, InsightService>();

// Swagger / OpenAPI for API Documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "Player Association API", 
        Version = "v1",
        Description = "API for managing Players, Events, and Insights"
    });
});

var app = builder.Build();

// ----------------------
// Middleware Pipeline
// ----------------------

// Serve Static Files (for uploaded images)
app.UseStaticFiles();

// Enable CORS
app.UseCors("AllowFrontend");

// Enable Swagger in Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Player Association API v1");
        c.RoutePrefix = string.Empty; // Swagger at root
    });
}

// HTTPS redirection
app.UseHttpsRedirection();

app.UseAuthorization();

// Map Controller Endpoints
app.MapControllers();

app.Run();
