public class GetCartResponse
{   
    public IList<CartItemResponse> CartItems { get; set; }
}

public class CartItemResponse 
{
    public string? Id {get; set;}
    public string? UserId {get; set;} 
    public string? SellerId {get; set;} 
    public string? SellerName {get; set;} 
    public string? Name {get; set;}
    public string? Description {get; set;}
    public decimal? Price {get; set;} 
    public string? ImageUrl {get; set;}
    public int? Status {get; set;}
    public string? ProductId {get; set;}
    public int? Quantity {get; set;}
}
