public class ProductView
{ 
    public string Id { get; set; }
    public string UserId { get; set; }
    public string UserName { get; set; }

    public string Name { get; set; }
    public string? Description { get; set; }
    public decimal Price { get; set; } = default;
    public int? Stock { get; set; }
    public string? ImageUrl {get; set;}

    public int Status {get; set;} = default!;

    public DateTime CreatedAt {get; set;} = DateTime.Now;
}