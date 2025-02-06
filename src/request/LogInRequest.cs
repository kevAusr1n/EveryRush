using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace EveryRush.Request;
public class LoginRequest 
{
    [Required]
    [JsonPropertyName("id")]
    public string? Id {get;set;}

    [Required]
    [JsonPropertyName("password")]
    public string? Password {get;set;}
}