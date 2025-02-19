using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Text.Json.Serialization;

namespace EveryRush.Request;
public class SignInRequest 
{
    [Required]
    [NotNull]
    [JsonPropertyName("email")]
    public string? Email {get;set;}

    [Required]
    [NotNull]
    [JsonPropertyName("password")]
    public string? Password {get;set;}
}