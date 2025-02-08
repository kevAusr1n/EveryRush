using EveryRush.Entity;

public class GetPaginatedOrdersResponse
{
    public int TotalCount { get; set; }
    public int TotalPages { get; set; }
    public List<Order> Orders { get; set; } = default!;
}