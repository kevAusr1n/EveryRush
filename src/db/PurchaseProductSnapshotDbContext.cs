using Microsoft.EntityFrameworkCore;

public class PurchaseProductSnapshotDbContext : DbContext
{
    public PurchaseProductSnapshotDbContext(DbContextOptions<PurchaseProductSnapshotDbContext> options) : base(options) {}

    public DbSet<PurchaseProductSnapshot> PurchaseProductSnapshots { get; set; }
}