using StaffGrid.Core.Enums;

namespace StaffGrid.Core.Entities;

public class Shift : BaseEntity
{
    public required string Title { get; set; }
    public string? Description { get; set; }
    public DateTime StartDateTime { get; set; }
    public DateTime EndDateTime { get; set; }
    public required string ProfessionalType { get; set; } // RN, LPN, CNA, etc.
    public string? Specialization { get; set; }
    public int NumberOfStaffNeeded { get; set; } = 1;
    public decimal PayRate { get; set; }
    public ShiftStatus Status { get; set; } = ShiftStatus.Draft;
    public bool IsUrgent { get; set; } = false;
    public string? Requirements { get; set; }
    public string? Notes { get; set; }

    // Broadcasting info
    public DateTime? BroadcastStartTime { get; set; }
    public AgencyTier? CurrentBroadcastTier { get; set; }
    public DateTime? TierExclusivityEndTime { get; set; }

    // Foreign keys
    public Guid FacilityId { get; set; }
    public Facility Facility { get; set; } = null!;

    public Guid DepartmentId { get; set; }
    public Department Department { get; set; } = null!;

    public Guid? AssignedStaffId { get; set; }
    public Staff? AssignedStaff { get; set; }

    public Guid CreatedByUserId { get; set; }
    public User CreatedByUser { get; set; } = null!;

    // Relationships
    public ICollection<ShiftResponse> Responses { get; set; } = new List<ShiftResponse>();
}
