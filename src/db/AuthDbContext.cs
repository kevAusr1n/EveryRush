using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using EveryRush.Entity;
using Microsoft.AspNetCore.Identity;

public class AuthDbContext : IdentityDbContext<AppUser, AppRole, string> 
{
    public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options) {}
}