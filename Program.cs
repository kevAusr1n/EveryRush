using System.Text;
using EveryRush.Entity;
using Google.Apis.Auth.AspNetCore3;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers().AddNewtonsoftJson
(
    options => options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
);

builder.Services.AddAuthorization();
builder.Services.AddDbContext<AppDbContext>
(
    connDbOptions => connDbOptions.UseMySql
    (
        builder.Configuration.GetConnectionString("AppDbContext"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("AppDbContext"))
    )
    .UseSeeding
    ((context, _) =>
        {
            var roles = context.Set<AppRole>().ToList();
            if (roles == null || roles.Count == 0)
            {
                context.Set<AppRole>().Add(new AppRole { Id = Guid.NewGuid().ToString(), Name = "Customer", NormalizedName = "CUSTOMER"});
                context.Set<AppRole>().Add(new AppRole { Id = Guid.NewGuid().ToString(), Name = "BusinessOwner", NormalizedName = "BUSINESSOWNER"});
                context.SaveChanges();
            }
        }
    )
    .UseAsyncSeeding
    (async (context, _, cancellationToken) =>
        {
            var roles = await context.Set<AppRole>().ToListAsync();
            if (roles == null || roles.Count == 0)
            {
                context.Set<AppRole>().Add(new AppRole { Name = "Customer" });
                context.Set<AppRole>().Add(new AppRole { Name = "BusinessOwner" });
                await context.SaveChangesAsync(cancellationToken);
            }
        }
    )
    .LogTo(Console.WriteLine, LogLevel.Error)
);

builder.Services
.AddIdentityApiEndpoints<AppUser>
(   
    options => 
    { 
        options.Tokens.PasswordResetTokenProvider = "NumericTokenProvider"; 
        options.Tokens.EmailConfirmationTokenProvider = "NumericTokenProvider"; 
    }
)
.AddRoles<AppRole>()
.AddEntityFrameworkStores<AppDbContext>()
.AddTokenProvider<NumericTokenProvider<AppUser>>("NumericTokenProvider");

builder.Services.Configure<IdentityOptions>
(
    options =>
    {
        // Password settings.
        options.Password.RequireDigit = true;
        options.Password.RequireLowercase = true;
        options.Password.RequireNonAlphanumeric = true;
        options.Password.RequireUppercase = true;
        options.Password.RequiredLength = 8;
        options.Password.RequiredUniqueChars = 1;

        // Lockout settings.
        options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
        options.Lockout.MaxFailedAccessAttempts = 5;
        options.Lockout.AllowedForNewUsers = true;

        // User settings.
        options.User.AllowedUserNameCharacters =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
        options.User.RequireUniqueEmail = false;
    }
);

builder.Services.AddCors
(
    options =>
    {
        options.AddPolicy(name: "AllowSelfFrontEnd", policy =>
        {
            policy
            .WithOrigins("http://localhost:5173")
            .AllowCredentials()
            .AllowAnyHeader()
            .AllowAnyMethod();
        });
    }
);

builder.Services.AddSignalR();

builder.Services.AddTransient<EmailSender>();
builder.Services.AddSingleton<IUserIdProvider, EmailUserIdProvider>();
builder.Services.AddScoped<FileService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("AllowSelfFrontEnd");

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHub<ChatHub>("/chatHub");
app.UseStaticFiles();

app.Run();
