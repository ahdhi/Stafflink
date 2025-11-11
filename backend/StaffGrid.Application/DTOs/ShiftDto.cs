using StaffGrid.Core.Enums;

namespace StaffGrid.Application.DTOs;

public class ShiftDto
{
    public Guid Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public DateTime StartDateTime { get; set; }
    public DateTime EndDateTime { get; set; }
    public required string ProfessionalType { get; set; }
    public string? Specialization { get; set; }
    public int NumberOfStaffNeeded { get; set; }
    public decimal PayRate { get; set; }
    public ShiftStatus Status { get; set; }
    public bool IsUrgent { get; set; }
    public string? Requirements { get; set; }
    public string? Notes { get; set; }
    public DateTime? BroadcastStartTime { get; set; }
    public AgencyTier? CurrentBroadcastTier { get; set; }
    public DateTime? TierExclusivityEndTime { get; set; }

    // Related entities
    public Guid FacilityId { get; set; }
    public string? FacilityName { get; set; }
    public Guid DepartmentId { get; set; }
    public string? DepartmentName { get; set; }
    public Guid? AssignedStaffId { get; set; }
    public string? AssignedStaffName { get; set; }
    public Guid CreatedByUserId { get; set; }
    public string? CreatedByUserName { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
