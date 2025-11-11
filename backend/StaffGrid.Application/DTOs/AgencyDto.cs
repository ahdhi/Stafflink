namespace StaffGrid.Application.DTOs;

public class AgencyDto
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public required string Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? ZipCode { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? LicenseNumber { get; set; }
    public bool IsActive { get; set; }
    public double FillRate { get; set; }
    public double AverageResponseTime { get; set; }
    public int TotalShiftsCompleted { get; set; }
    public double AverageRating { get; set; }
    public int StaffCount { get; set; }
}
