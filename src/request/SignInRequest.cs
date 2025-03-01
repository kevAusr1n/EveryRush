using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Text.Json.Serialization;
using Newtonsoft.Json;

namespace EveryRush.Request;
public class SignInRequest 
{
    [Required]
    [NotNull]
    [JsonProperty("email")]
    public string? Email {get;set;}

    [Required]
    [NotNull]
    [JsonProperty("password")]
    public string? Password {get;set;}

    [JsonProperty("confirm_required")]
    public Boolean ConfirmRequired {get;set;} = true;

    public String? Provider {get;set;}
}