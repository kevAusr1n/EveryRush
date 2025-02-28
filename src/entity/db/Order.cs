
using EveryRush.Entity;

public class Order {
    public string? Id {get; set;}
    public string? AppUserId {get;set;}
    public string? SellerId {get;set;}
    public int? Status {get;set;}

    public  string? FullName {get; set;}
    public  string? Email {get; set;}
    public  string? Phone {get; set;}
    public string? Address {get; set;}
    public decimal TotalPrice {get; set;} = 0;
    public DateTime? CreatedAt {get; set;} = DateTime.Now;
    public AppUser? AppUser {get;set;}

    public ICollection<PurchaseProduct>? PurchaseProductSnapshots {get;set;}

    public ICollection<OrderProcess>? OrderProcesses {get;set;}
}