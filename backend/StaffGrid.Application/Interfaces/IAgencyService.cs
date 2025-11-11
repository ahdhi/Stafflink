using StaffGrid.Application.DTOs;

namespace StaffGrid.Application.Interfaces;

public interface IAgencyService
{
    Task<AgencyDto> GetByIdAsync(Guid id);
    Task<(List<AgencyDto> Agencies, int TotalCount)> GetAllAsync(int page = 1, int pageSize = 20);
    Task<List<AgencyDto>> GetMyAgenciesAsync(Guid userId);
}
