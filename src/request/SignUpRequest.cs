using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Text.Json.Serialization;
using Newtonsoft.Json;

namespace EveryRush.Request;

public class SignUpRequest 
{   
    [Required]
    public string? UserName {get;set;}

    [Required]
    [NotNull]
    public string? Email {get;set;}

    public string? Mobile {get;set;}

    public string? Password {get;set;}
    
    [Required]
    [NotNull]
    public string? Role {get;set;}

    [Required]
    [NotNull]
    [JsonProperty("signin_required")]
    public bool doSignInAfterSignUp {get;set;} = false;

    public string Provider {get;set;}
}