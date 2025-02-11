public class Process {
    public string? Id {get;set;}
    public string? OrderId {get;set;}
    public string? Event {get;set;}
    public int? Status {get;set;}
    public int? InitiatorId {get;set;}
    public DateTime? Date {get;set;}
    public Order? Order {get;set;}
}