using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using EveryRush.Entity;

public class AppDbContext : IdentityDbContext<AppUser, AppRole, string> 
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public DbSet<Contact> Contacts {get;set;}

    public DbSet<Product> Products {get;set;}

    public DbSet<Order> Orders {get;set;}

    public DbSet<CartItem> CartItems {get;set;}

    public DbSet<Process> Processes {get;set;}

    public DbSet<PurchaseProductSnapshot> PurchaseProductSnapshots {get;set;}
}