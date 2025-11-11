namespace StaffGrid.Application.DTOs;

public class AuthResponse
{
    public required UserDto User { get; set; }
    public required string Token { get; set; }
    public required string RefreshToken { get; set; }
    public DateTime ExpiresAt { get; set; }
}
