public class AddProductRequest
{
    public string UserId { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public IList<IFormFile> Files {get; set;}
}