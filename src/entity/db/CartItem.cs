using EveryRush.Entity;
using Google.Apis.Drive.v3.Data;

public class CartItem {
    public string? Id {get; set;}
    public string? AppUserId {get; set;}
    public string? ProductId {get; set;} 
    public int? Quantity {get; set;}

    public AppUser? AppUser {get; set;}
}