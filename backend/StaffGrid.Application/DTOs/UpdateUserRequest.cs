using StaffGrid.Core.Enums;

namespace StaffGrid.Application.DTOs;

public class UpdateUserRequest
{
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public UserRole? Role { get; set; }
    public bool? IsActive { get; set; }
    public Guid? CorporateId { get; set; }
    public Guid? FacilityId { get; set; }
    public Guid? AgencyId { get; set; }
}
