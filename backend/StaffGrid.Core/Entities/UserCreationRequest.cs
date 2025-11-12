using StaffGrid.Core.Enums;

namespace StaffGrid.Core.Entities;

public class UserCreationRequest : BaseEntity
{
    public required string Name { get; set; }
    public required string Email { get; set; }
    public string? PhoneNumber { get; set; }
    public UserRole Role { get; set; }
    public ApprovalStatus ApprovalStatus { get; set; } = ApprovalStatus.Pending;

    // Foreign keys
    public Guid RequestedBy { get; set; }
    public User RequestedByUser { get; set; } = null!;

    public Guid? ApprovedBy { get; set; }
    public User? ApprovedByUser { get; set; }

    public Guid? CorporateId { get; set; }
    public Corporate? Corporate { get; set; }

    public Guid? FacilityId { get; set; }
    public Facility? Facility { get; set; }

    public Guid? AgencyId { get; set; }
    public Agency? Agency { get; set; }

    // Approval metadata
    public DateTime? ApprovedAt { get; set; }
    public string? RejectionReason { get; set; }
    public string? Notes { get; set; }

    // Created user reference (after approval)
    public Guid? CreatedUserId { get; set; }
    public User? CreatedUser { get; set; }
}
