using EveryRush.Entity;

public class GetPaginatedMarketResponse
{
    public int TotalCount { get; set; }
    public int TotalPages { get; set; }
    public List<Product> Products { get; set; } = default!;
}