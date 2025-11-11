using StaffGrid.Application.DTOs;

namespace StaffGrid.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<AuthResponse> RefreshTokenAsync(string refreshToken);
    Task<bool> LogoutAsync(Guid userId);
    Task<UserDto?> GetCurrentUserAsync(Guid userId);
}
