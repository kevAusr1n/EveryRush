using Newtonsoft.Json;

public class GetPaginatedOrdersResponse
{
    public int TotalCount { get; set; }
    public int TotalPages { get; set; }

    [JsonProperty("orders")]
    public List<OrderView> Orders { get; set; } = default!;
}