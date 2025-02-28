public class OrderProcess {
    public string? Id {get;set;}
    public string? OrderId {get;set;}
    public string? Event {get;set;}
    public string? Comment {get;set;}
    public int? FromOrderStatus {get;set;}
    public int? ToOrderStatus {get;set;}
    public DateTime? CreateAt {get;set;}
    public Order? Order {get;set;}
    public ICollection<AppFile>? AppFiles {get; set;}
}