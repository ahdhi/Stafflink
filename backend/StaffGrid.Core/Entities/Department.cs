namespace StaffGrid.Core.Entities;

public class Department : BaseEntity
{
    public required string Name { get; set; }
    public string? Code { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;

    // Foreign keys
    public Guid FacilityId { get; set; }
    public Facility Facility { get; set; } = null!;

    // Relationships
    public ICollection<Shift> Shifts { get; set; } = new List<Shift>();
}
