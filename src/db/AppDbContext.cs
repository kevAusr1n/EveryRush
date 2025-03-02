using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using EveryRush.Entity;

public class AppDbContext : IdentityDbContext<AppUser, AppRole, string> 
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public DbSet<AppUser> AppUsers {get;set;}

    public DbSet<Contact> Contacts {get;set;}

    public DbSet<Product> Products {get;set;}

    public DbSet<Order> Orders {get;set;}

    public DbSet<CartItem> CartItems {get;set;}

    public DbSet<OrderProcess> OrderProcesses {get;set;}

    public DbSet<PurchaseProduct> PurchaseProducts {get;set;}

    public DbSet<AppFile> AppFiles {get;set;}

    public DbSet<ProductReview> ProductReviews {get;set;}

    public DbSet<UserChatConnection> UserChatConnections {get;set;}

    public DbSet<ChatMessage> ChatMessages {get;set;}

    public DbSet<VerificationCode> VerificationCodes {get;set;}
}
