namespace StaffGrid.Core.Entities;

public class Facility : BaseEntity
{
    public required string Name { get; set; }
    public required string Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? ZipCode { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public bool IsActive { get; set; } = true;

    // Foreign keys
    public Guid? CorporateId { get; set; }
    public Corporate? Corporate { get; set; }

    // Relationships
    public ICollection<Department> Departments { get; set; } = new List<Department>();
    public ICollection<User> Users { get; set; } = new List<User>();
    public ICollection<Shift> Shifts { get; set; } = new List<Shift>();
    public ICollection<FacilityAgency> FacilityAgencies { get; set; } = new List<FacilityAgency>();
}
