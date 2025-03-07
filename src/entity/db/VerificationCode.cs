public class VerificationCode {
    public string Id { get; set; }
    public string AppUserId {get; set;}

    public string? Type {get; set;}

    public string Token {get; set;}

    public DateTime CreatedAt {get; set;}

    public DateTime? Expiration {get; set;}
}