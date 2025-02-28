using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using EveryRush.Entity;
using Newtonsoft.Json;

public class PlaceOrderRequest 
{
    [JsonProperty("orders")]
    public IList<OrderRquest> OrderRquests {get; set;}
}

public class OrderRquest {
    [Required]
    [NotNull]
    public string UserId {get; set;}
    
    [Required]
    [NotNull]
    public IList<PurchaseProductRequest> PurchaseProducts {get; set;}

    [Required]
    [NotNull]
    public  string FullName {get; set;}

    [Required]
    [NotNull]
    public  string Email {get; set;}

    [Required]
    [NotNull]
    public  string Phone {get; set;}

    [Required]
    [NotNull]
    public string Address {get; set;}

    public DateTime CreatedAt {get; set;} = DateTime.Now;
}

public class PurchaseProductRequest {
    [Required]
    [NotNull]
    public  string? Id {get; set;}

    [Required]
    [NotNull]
    public int Quantity {get; set;} = 0;
}