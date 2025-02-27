using System.ComponentModel.DataAnnotations;
using EveryRush.Entity;
using Newtonsoft.Json;

public class PlaceOrderRequest 
{
    [Required]
    public string UserId {get; set;}
    
    [Required]
    [JsonProperty("ordered_products")]
    public IList<PurchaseProductSnapshot> PurchaseProductSnapshots {get; set;}

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