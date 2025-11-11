using StaffGrid.Core.Enums;

namespace StaffGrid.Application.DTOs;

public class ShiftListDto
{
    public Guid Id { get; set; }
    public required string Title { get; set; }
    public DateTime StartDateTime { get; set; }
    public DateTime EndDateTime { get; set; }
    public required string ProfessionalType { get; set; }
    public ShiftStatus Status { get; set; }
    public bool IsUrgent { get; set; }
    public string? FacilityName { get; set; }
    public string? DepartmentName { get; set; }
    public string? AssignedStaffName { get; set; }
    public decimal PayRate { get; set; }
    public int NumberOfStaffNeeded { get; set; }
}
