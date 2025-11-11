using StaffGrid.Application.DTOs;

namespace StaffGrid.Application.Interfaces;

public interface IStaffService
{
    Task<StaffDto> GetByIdAsync(Guid id);
    Task<(List<StaffDto> Staff, int TotalCount)> GetAllAsync(int page = 1, int pageSize = 20, Guid? agencyId = null, string? professionalType = null, bool? isAvailable = null);
    Task<StaffDto> CreateAsync(CreateStaffRequest request, Guid userId);
    Task<StaffDto> UpdateAsync(Guid id, CreateStaffRequest request, Guid userId);
    Task<bool> DeleteAsync(Guid id, Guid userId);
    Task<List<StaffDto>> GetMyStaffAsync(Guid userId);
}
