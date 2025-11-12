using StaffGrid.Core.Enums;

namespace StaffGrid.Application.DTOs;

public class CreateUserCreationRequest
{
    public required string Name { get; set; }
    public required string Email { get; set; }
    public string? PhoneNumber { get; set; }
    public UserRole Role { get; set; }
    public Guid? CorporateId { get; set; }
    public Guid? FacilityId { get; set; }
    public Guid? AgencyId { get; set; }
    public string? Notes { get; set; }
}
