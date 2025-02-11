using EveryRush.Entity;

public class AppFile {
    public string? Id { get; set; }

    public string? Name { get; set; }
    
    public string? ProductId { get; set; }

    public string? ProcessId { get; set; }

    public string? Format {get; set;}
    public byte[]? Content { get; set; }

    public Product Product {get; set;}

    public Process Process {get; set;}
}