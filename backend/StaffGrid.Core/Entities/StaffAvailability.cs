namespace StaffGrid.Core.Entities;

public class StaffAvailability : BaseEntity
{
    public Guid StaffId { get; set; }
    public Staff Staff { get; set; } = null!;

    public DayOfWeek DayOfWeek { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public bool IsAvailable { get; set; } = true;

    // For specific date overrides
    public DateTime? SpecificDate { get; set; }
    public string? Notes { get; set; }
}
