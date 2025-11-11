using System.ComponentModel.DataAnnotations;

namespace StaffGrid.Application.DTOs;

public class RefreshTokenRequest
{
    [Required]
    public required string RefreshToken { get; set; }
}
