using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using EveryRush.Entity;
using Newtonsoft.Json;

public class PlaceOrderRequest 
{
    [JsonProperty("orders")]
    public IList<OrderRquest >OrderRquests {get; set;}
}

public class OrderRquest {
    [Required]
    [NotNull]
    public string UserId {get; set;}
    
    [Required]
    public IList<CartItem> CartItems {get; set;}

    [Required]
    public  string FullName {get; set;}

    [Required]
    public  string Email {get; set;}

    [Required]
    public  string Phone {get; set;}

    [Required]
    public string Address {get; set;}

    public DateTime CreatedAt {get; set;} = DateTime.Now;
}