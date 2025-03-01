public class PurchaseProduct {
    public string? Id { get; set; }

    public string? AppUserId { get; set; }
    public string? OrderId { get; set; }

    public string? ProductId { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }    
    public int? Quantity { get; set; }
    public decimal? Price { get; set; }
    public DateTime? CreatedAt { get; set; }
    public Order? Order {get; set;}
}