namespace StaffGrid.Core.Entities;

public class Staff : BaseEntity
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? ZipCode { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? LicenseNumber { get; set; }
    public DateTime? LicenseExpiryDate { get; set; }
    public string? ProfessionalType { get; set; } // RN, LPN, CNA, etc.
    public string? Specialization { get; set; }
    public int YearsOfExperience { get; set; } = 0;
    public double HourlyRate { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsAvailable { get; set; } = true;

    // Foreign keys
    public Guid AgencyId { get; set; }
    public Agency Agency { get; set; } = null!;

    // Performance metrics
    public double AverageRating { get; set; } = 0;
    public int TotalShiftsCompleted { get; set; } = 0;
    public int NoShowCount { get; set; } = 0;

    // Relationships
    public ICollection<Certification> Certifications { get; set; } = new List<Certification>();
    public ICollection<StaffAvailability> Availabilities { get; set; } = new List<StaffAvailability>();
    public ICollection<Shift> Shifts { get; set; } = new List<Shift>();
}
