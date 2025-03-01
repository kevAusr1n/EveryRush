public class SignUpResponse : BasicRequestResponse {
    public string? Id {get; set;}
    public string? Email {get; set;} = UserConfig.USER_NOT_EXIST;
    public string? UserName {get; set;}
    public string? Role {get; set;}

    public string? Jwt {get;set;}

    public string? Provider {get;set;}
}