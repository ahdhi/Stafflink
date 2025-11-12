using StaffGrid.Core.Enums;

namespace StaffGrid.Application.DTOs;

public class UserCreationRequestDto
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
    public string? PhoneNumber { get; set; }
    public UserRole Role { get; set; }
    public ApprovalStatus ApprovalStatus { get; set; }
    public Guid RequestedBy { get; set; }
    public string? RequestedByName { get; set; }
    public Guid? ApprovedBy { get; set; }
    public string? ApprovedByName { get; set; }
    public Guid? CorporateId { get; set; }
    public string? CorporateName { get; set; }
    public Guid? FacilityId { get; set; }
    public string? FacilityName { get; set; }
    public Guid? AgencyId { get; set; }
    public string? AgencyName { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public string? RejectionReason { get; set; }
    public string? Notes { get; set; }
    public Guid? CreatedUserId { get; set; }
    public DateTime CreatedAt { get; set; }
}
