using StaffGrid.Application.DTOs;

namespace StaffGrid.Application.Interfaces;

public interface IFacilityManagementService
{
    Task<IEnumerable<FacilityDto>> GetAllFacilitiesAsync();
    Task<IEnumerable<FacilityDto>> GetFacilitiesByCorporateAsync(Guid corporateId);
    Task<FacilityDto?> GetFacilityByIdAsync(Guid facilityId);
    Task<FacilityDto> CreateFacilityAsync(CreateFacilityRequest request);
    Task<bool> UpdateFacilityAsync(Guid facilityId, UpdateFacilityRequest request);
    Task<bool> DeleteFacilityAsync(Guid facilityId);
}
