using System.ComponentModel.DataAnnotations;

namespace StaffGrid.Application.DTOs;

public class CreateStaffRequest
{
    [Required]
    [MaxLength(100)]
    public required string FirstName { get; set; }

    [Required]
    [MaxLength(100)]
    public required string LastName { get; set; }

    [EmailAddress]
    public string? Email { get; set; }

    [Phone]
    public string? PhoneNumber { get; set; }

    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? ZipCode { get; set; }
    public DateTime? DateOfBirth { get; set; }

    [Required]
    public string? LicenseNumber { get; set; }

    public DateTime? LicenseExpiryDate { get; set; }

    [Required]
    [MaxLength(50)]
    public required string ProfessionalType { get; set; }

    public string? Specialization { get; set; }
    public int YearsOfExperience { get; set; }

    [Required]
    [Range(0, 500)]
    public double HourlyRate { get; set; }
}
