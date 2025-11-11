namespace StaffGrid.Core.Entities;

public class Corporate : BaseEntity
{
    public required string Name { get; set; }
    public required string Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? ZipCode { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public bool IsActive { get; set; } = true;

    // Relationships
    public ICollection<Facility> Facilities { get; set; } = new List<Facility>();
    public ICollection<User> Users { get; set; } = new List<User>();
}
