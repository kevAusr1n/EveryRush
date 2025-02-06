namespace EveryRush.Entity;

public class Product 
{ 
    public string? Id { get; set; }

    public string? OwnerId { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public decimal? Price { get; set; }
    public int? Stock { get; set; }
}