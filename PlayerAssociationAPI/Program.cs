using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using PlayerAssociationAPI.Data;
using PlayerAssociationAPI.Services.Interfaces;
using PlayerAssociationAPI.Services.Implementations;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure file upload limits
builder.Services.Configure<FormOptions>(options =>
{
    options.ValueLengthLimit = int.MaxValue;
    options.MultipartBodyLengthLimit = int.MaxValue; // 100MB
    options.MemoryBufferThreshold = int.MaxValue;
});

// Add CORS (adjust origins as needed)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000") // React app URL
                   .AllowAnyMethod()
                   .AllowAnyHeader()
                   .AllowCredentials();
        });
});

// Configure DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register ALL services
builder.Services.AddScoped<IPlayerService, PlayerService>();
builder.Services.AddScoped<IEventService, EventService>(); // ADDED THIS LINE
builder.Services.AddScoped<IInsightService, InsightService>(); // ADD THIS LINE
// Add required services for file uploads
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddHttpContextAccessor(); // Also add this for better DI

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Create wwwroot/uploads directory if it doesn't exist
var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
if (!Directory.Exists(uploadsPath))
{
    Directory.CreateDirectory(uploadsPath);
    Console.WriteLine($"Created uploads directory: {uploadsPath}");
}

// Enable static files (for serving uploaded images)
app.UseStaticFiles();

// Enable CORS - must come before UseAuthorization and MapControllers
app.UseCors("AllowReactApp");

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// Log startup information
Console.WriteLine($"Application started. Uploads path: {uploadsPath}");
Console.WriteLine($"Environment: {app.Environment.EnvironmentName}");
Console.WriteLine($"Database connection: {builder.Configuration.GetConnectionString("DefaultConnection")}");

try 
{
    app.Run();
}
catch (Exception ex)
{
    Console.WriteLine("CRITICAL ERROR DURING STARTUP:");
    Console.WriteLine(ex.ToString());
    throw;
}