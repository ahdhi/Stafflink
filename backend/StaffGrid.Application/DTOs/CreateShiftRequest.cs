using System.ComponentModel.DataAnnotations;

namespace StaffGrid.Application.DTOs;

public class CreateShiftRequest
{
    [Required]
    [MaxLength(200)]
    public required string Title { get; set; }

    [MaxLength(1000)]
    public string? Description { get; set; }

    [Required]
    public DateTime StartDateTime { get; set; }

    [Required]
    public DateTime EndDateTime { get; set; }

    [Required]
    [MaxLength(50)]
    public required string ProfessionalType { get; set; }

    [MaxLength(100)]
    public string? Specialization { get; set; }

    [Range(1, 100)]
    public int NumberOfStaffNeeded { get; set; } = 1;

    [Required]
    [Range(0, 1000)]
    public decimal PayRate { get; set; }

    public bool IsUrgent { get; set; } = false;

    [MaxLength(500)]
    public string? Requirements { get; set; }

    [MaxLength(500)]
    public string? Notes { get; set; }

    [Required]
    public Guid DepartmentId { get; set; }
}
