using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace EveryRush.Request;

public class RegisterRequest 
{   
    [Required]
    [JsonPropertyName("username")]
    public string? UserName {get;set;}

    [Required]
    [JsonPropertyName("email")]
    public string? Email {get;set;}

    [JsonPropertyName("mobile")]
    public string? Mobile {get;set;}

    [Required]
    [JsonPropertyName("password")]
    public string? Password {get;set;}
    
    [JsonPropertyName("role")]
    public string? Role {get;set;}
}