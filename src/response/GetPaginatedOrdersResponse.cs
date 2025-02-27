using Newtonsoft.Json;

public class GetPaginatedOrdersResponse
{
    public int TotalCount { get; set; }
    public int TotalPages { get; set; }

    [JsonProperty("orders")]
    public List<OrderResponse> Orders { get; set; } = default!;
}

public class OrderResponse() {
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

    [JsonProperty("cartitems")]
    public ICollection<PurchaseProductSnapshot>? PurchaseProductSnapshots {get;set;}

    [JsonProperty("orderprocesses")]
    public ICollection<OrderProcess>? OrderProcesses {get;set;}
}