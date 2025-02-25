public class GetUserResponse : GeneralOperationResponse {
    public string? Id {get; set;}
    public string? Email {get; set;} = UserConfig.USER_NOT_EXIST;
    public string? UserName {get; set;}
    public string? Role {get; set;}

    public string? Jwt {get;set;}
}