namespace EveryRush.Entity;

public class Product 
{ 
    public string Id { get; set; }
    public string AppUserId { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
    public decimal Price { get; set; } = default;
    public int? Stock { get; set; }
    public string? ImageUrl {get; set;}

    public int Status {get; set;} = default!;

    public DateTime CreatedAt {get; set;} = DateTime.Now;

    public AppUser? User {get; set;}

    public ICollection<AppFile>? AppFiles {get; set;}

    public ICollection<ProductReview>? ProductReviews {get; set;}
}