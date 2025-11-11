namespace StaffGrid.Application.DTOs;

public class StaffDto
{
    public Guid Id { get; set; }
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
    public required string ProfessionalType { get; set; }
    public string? Specialization { get; set; }
    public int YearsOfExperience { get; set; }
    public double HourlyRate { get; set; }
    public bool IsActive { get; set; }
    public bool IsAvailable { get; set; }
    public Guid AgencyId { get; set; }
    public string? AgencyName { get; set; }
    public double AverageRating { get; set; }
    public int TotalShiftsCompleted { get; set; }
    public int NoShowCount { get; set; }
}
