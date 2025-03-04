public class WriteReviewRequest
{
    public string UserId { get; set; }
    public string ProductId { get; set; }
    public string OrderId { get; set; }
    public string Content { get; set; }
    public int Rating { get; set; } 
    public int Type { get; set; } = ProductReviewDefinition.Type.REVIEW;
}