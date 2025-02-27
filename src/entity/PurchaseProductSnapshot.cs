public class PurchaseProductSnapshot {
    public string? Id { get; set; }

    public string? AppUserId { get; set; }
    public string? OrderId { get; set; }

    public string? ProductId { get; set; }
    public string? ProductName { get; set; }
    public string? ProductDescription { get; set; }
    public string? ProductImageUrl { get; set; }    
    public int? Quantity { get; set; }
    public decimal? Price { get; set; }
    public DateTime? CreateAt { get; set; }
    public Order? Order {get; set;}
}