public class EditUserRequest {
    public string? Id { get; set; } = default;
    public string? Username { get; set; } = default;
    public string? OldPassword { get; set; } = default;

    public string? NewPassword { get; set; } = default;
}