using EveryRush.Entity;
using Newtonsoft.Json;

public class GetPaginatedProductsResponse
{
    public int TotalCount { get; set; }
    public int TotalPages { get; set; }
    public List<Product> Products { get; set; } = default!;
}