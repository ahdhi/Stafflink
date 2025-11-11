using StaffGrid.Core.Enums;

namespace StaffGrid.Core.Entities;

public class Agency : BaseEntity
{
    public required string Name { get; set; }
    public required string Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? ZipCode { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? LicenseNumber { get; set; }
    public bool IsActive { get; set; } = true;

    // Performance metrics
    public double FillRate { get; set; } = 0;
    public double AverageResponseTime { get; set; } = 0; // in hours
    public int TotalShiftsCompleted { get; set; } = 0;
    public double AverageRating { get; set; } = 0;

    // Relationships
    public ICollection<User> Users { get; set; } = new List<User>();
    public ICollection<Staff> Staff { get; set; } = new List<Staff>();
    public ICollection<FacilityAgency> FacilityAgencies { get; set; } = new List<FacilityAgency>();
    public ICollection<ShiftResponse> ShiftResponses { get; set; } = new List<ShiftResponse>();
}
