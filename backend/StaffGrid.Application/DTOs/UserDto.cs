using StaffGrid.Core.Enums;

namespace StaffGrid.Application.DTOs;

public class UserDto
{
    public Guid Id { get; set; }
    public required string Email { get; set; }
    public required string Name { get; set; }
    public UserRole Role { get; set; }
    public string? PhoneNumber { get; set; }
    public bool IsActive { get; set; }
    public ApprovalStatus ApprovalStatus { get; set; }
    public Guid? CorporateId { get; set; }
    public Guid? FacilityId { get; set; }
    public Guid? AgencyId { get; set; }
}
