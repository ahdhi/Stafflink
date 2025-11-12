using StaffGrid.Core.Enums;

namespace StaffGrid.Application.DTOs;

public class UserListDto
{
    public Guid Id { get; set; }
    public required string Email { get; set; }
    public required string Name { get; set; }
    public UserRole Role { get; set; }
    public bool IsActive { get; set; }
    public ApprovalStatus ApprovalStatus { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? CorporateName { get; set; }
    public string? FacilityName { get; set; }
    public string? AgencyName { get; set; }
}
