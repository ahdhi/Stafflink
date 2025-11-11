using System.ComponentModel.DataAnnotations;
using StaffGrid.Core.Enums;

namespace StaffGrid.Application.DTOs;

public class UpdateShiftRequest
{
    [MaxLength(200)]
    public string? Title { get; set; }

    [MaxLength(1000)]
    public string? Description { get; set; }

    public DateTime? StartDateTime { get; set; }

    public DateTime? EndDateTime { get; set; }

    [MaxLength(50)]
    public string? ProfessionalType { get; set; }

    [MaxLength(100)]
    public string? Specialization { get; set; }

    [Range(1, 100)]
    public int? NumberOfStaffNeeded { get; set; }

    [Range(0, 1000)]
    public decimal? PayRate { get; set; }

    public ShiftStatus? Status { get; set; }

    public bool? IsUrgent { get; set; }

    [MaxLength(500)]
    public string? Requirements { get; set; }

    [MaxLength(500)]
    public string? Notes { get; set; }

    public Guid? DepartmentId { get; set; }

    public Guid? AssignedStaffId { get; set; }
}
