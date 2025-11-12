using StaffGrid.Core.Enums;

namespace StaffGrid.Application.DTOs;

public class UserDetailsDto
{
    public Guid Id { get; set; }
    public required string Email { get; set; }
    public required string Name { get; set; }
    public UserRole Role { get; set; }
    public string? PhoneNumber { get; set; }
    public bool IsActive { get; set; }
    public ApprovalStatus ApprovalStatus { get; set; }
    public Guid? ApprovedBy { get; set; }
    public string? ApproverName { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    // Organization details
    public Guid? CorporateId { get; set; }
    public string? CorporateName { get; set; }
    public Guid? FacilityId { get; set; }
    public string? FacilityName { get; set; }
    public Guid? AgencyId { get; set; }
    public string? AgencyName { get; set; }
}
