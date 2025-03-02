public class ProductReviewView {
    public string? Id {get; set;} = default;
    public string? Content {get; set;} = default;
    public string? ReviewerId {get; set;} = default;

    public string? ReviewerName {get; set;} = default;
    public string? OrderId {get; set;} = default;
    public string? ProductId {get; set;} = default;
    public int? Type {get;set;} = default;
    public int? Rating {get; set;} = default;
    public string? ReplyToId {get; set;} = default;
    public string? ReplierrId {get; set;} = default;
    public string? ReplierName {get; set;} = default;
    public DateTime? CreatedAt {get; set;} = DateTime.Now;
}