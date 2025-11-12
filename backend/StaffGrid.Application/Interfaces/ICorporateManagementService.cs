using StaffGrid.Application.DTOs;

namespace StaffGrid.Application.Interfaces;

public interface ICorporateManagementService
{
    Task<IEnumerable<CorporateDto>> GetAllCorporatesAsync();
    Task<CorporateDto?> GetCorporateByIdAsync(Guid corporateId);
    Task<CorporateDto> CreateCorporateAsync(CreateCorporateRequest request);
    Task<bool> UpdateCorporateAsync(Guid corporateId, UpdateCorporateRequest request);
    Task<bool> DeleteCorporateAsync(Guid corporateId);
}
