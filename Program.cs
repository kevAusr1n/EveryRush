using ContactManager.Authorization;
using EveryRush.Entity;
using Google.Apis.Auth.AspNetCore3;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers().AddNewtonsoftJson(options =>
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
);
builder.Services.AddAuthentication();

/*builder.Services.AddAuthorization
(
    options =>
    {
        options.FallbackPolicy = new AuthorizationPolicyBuilder()
            .RequireAuthenticatedUser()
            .Build();
    }
);*/

builder.Services.AddDbContext<AppDbContext>
(
    connDbOptions => connDbOptions.UseMySql
    (
        "server=127.0.0.1;port=3306;user=root;password=key123456;database=identitymysqldatabase", 
        new MySqlServerVersion(new Version(8, 4, 3))
    )
);

builder.Services
.AddIdentityApiEndpoints<AppUser>()
.AddRoles<AppRole>()
.AddEntityFrameworkStores<AppDbContext>();

builder.Services.Configure<IdentityOptions>
(
    options =>
    {
        // Password settings.
        options.Password.RequireDigit = true;
        options.Password.RequireLowercase = true;
        options.Password.RequireNonAlphanumeric = true;
        options.Password.RequireUppercase = true;
        options.Password.RequiredLength = 6;
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
        options.AddPolicy(name: "AllowAnyOrigin", policy =>
        {
            policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
        });
    }
);

builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<ProductService>();
builder.Services.AddScoped<ContactService>();

//builder.Services.AddScoped<IAuthorizationHandler, CustomerAuthorizationHandler>();
//builder.Services.AddScoped<IAuthorizationHandler, BusinessOwnerAuthorizationHandler>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors("AllowAnyOrigin");

app.UseAuthentication();
//app.UseAuthorization();
app.MapStaticAssets();
app.MapControllers();
app.MapIdentityApi<AppUser>();

app.Run();
