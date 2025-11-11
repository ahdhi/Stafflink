using StaffGrid.Core.Enums;

namespace StaffGrid.Core.Entities;

public class User : BaseEntity
{
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public required string Name { get; set; }
    public required UserRole Role { get; set; }
    public string? PhoneNumber { get; set; }
    public bool IsActive { get; set; } = true;
    public ApprovalStatus ApprovalStatus { get; set; } = ApprovalStatus.Pending;
    public Guid? ApprovedBy { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }

    // Navigation properties based on role
    public Guid? CorporateId { get; set; }
    public Corporate? Corporate { get; set; }

    public Guid? FacilityId { get; set; }
    public Facility? Facility { get; set; }

    public Guid? AgencyId { get; set; }
    public Agency? Agency { get; set; }

    // Relationships
    public User? Approver { get; set; }
    public ICollection<User> ApprovedUsers { get; set; } = new List<User>();
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
}
