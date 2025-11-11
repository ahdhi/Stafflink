using StaffGrid.Core.Enums;

namespace StaffGrid.Core.Entities;

public class ShiftResponse : BaseEntity
{
    public Guid ShiftId { get; set; }
    public Shift Shift { get; set; } = null!;

    public Guid AgencyId { get; set; }
    public Agency Agency { get; set; } = null!;

    public Guid? ProposedStaffId { get; set; }
    public Staff? ProposedStaff { get; set; }

    public ResponseStatus Status { get; set; } = ResponseStatus.Pending;
    public decimal? ProposedRate { get; set; }
    public string? Notes { get; set; }
    public DateTime ResponseTime { get; set; } = DateTime.UtcNow;
    public DateTime? AcceptedAt { get; set; }
    public DateTime? DeclinedAt { get; set; }
    public string? DeclineReason { get; set; }
}
