using System.ComponentModel.DataAnnotations;
using EveryRush.Entity;
using Newtonsoft.Json;

public class MakeOrderRequest 
{
    [Required]
    public string UserId {get; set;}
    
    [Required]
    [JsonProperty("products_for_purchase")]
    public IList<PurchaseProductSnapshot> PurchaseProductSnapshots {get; set;} = [];
}