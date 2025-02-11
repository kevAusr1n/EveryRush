using EveryRush.Entity;

public class MakeOrderRequest {
    public string UserId {get; set;}
    
    public IList<Product> Products {get; set;}
}