
using EveryRush.Entity;

public class Order {
    public string? Id {get; set;}
    public string? AppUserId {get;set;}
    
    public DateTime? Date {get;set;}

    public AppUser? AppUser {get;set;}

    public ICollection<PurchaseProductSnapshot>? PurchaseProductSnapshots {get;set;}

    public ICollection<Process>? Processes {get;set;}
}