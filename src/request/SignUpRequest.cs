using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Text.Json.Serialization;

namespace EveryRush.Request;

public class SignUpRequest 
{   
    [Required]
    [JsonPropertyName("username")]
    public string? UserName {get;set;}

    [Required]
    [NotNull]
    [JsonPropertyName("email")]
    public string? Email {get;set;}

    [JsonPropertyName("mobile")]
    public string? Mobile {get;set;}

    [Required]
    [NotNull]
    [JsonPropertyName("password")]
    public string? Password {get;set;}
    
    [Required]
    [NotNull]
    [JsonPropertyName("role")]
    public string? Role {get;set;}

    [Required]
    [NotNull]
    [JsonPropertyName("signin_required")]
    public bool doSignInAfterSignUp {get;set;}
}