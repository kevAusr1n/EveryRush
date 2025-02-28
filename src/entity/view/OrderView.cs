using Newtonsoft.Json;

public class OrderView {
    public string? Id {get; set;}
    public string? BuyerId {get;set;}
    public string? BuyerName {get;set;}
    public string? SellerId {get;set;}
    public string? SellerName {get;set;}
    public int? Status {get;set;}
    public  string FullName {get; set;}
    public  string Email {get; set;}
    public  string Phone {get; set;}
    public string Address {get; set;}

    public decimal TotalPrice {get; set;}
    public DateTime CreatedAt {get; set;}

    [JsonProperty("purchaseProducts")]
    public ICollection<PurchaseProductView>? PurchaseProducts {get;set;}

    [JsonProperty("orderProcesses")]
    public ICollection<OrderProcessView>? OrderProcesses {get;set;}
}