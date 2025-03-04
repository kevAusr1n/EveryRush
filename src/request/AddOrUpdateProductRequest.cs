public class AddOrUpdateProductRequest
{
    public string? Id {get; set;}
    public string UserId { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
    public decimal Price { get; set; } = 0;
    public int? Stock { get; set; }
    public string? ToKeepImageUrl {get; set;}
    public IList<IFormFile>? Files {get; set;}
}