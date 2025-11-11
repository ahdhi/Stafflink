using StaffGrid.Application.DTOs;
using StaffGrid.Core.Enums;

namespace StaffGrid.Application.Interfaces;

public interface IShiftService
{
    Task<ShiftDto> GetByIdAsync(Guid id);
    Task<(List<ShiftListDto> Shifts, int TotalCount)> GetAllAsync(
        int page = 1,
        int pageSize = 20,
        ShiftStatus? status = null,
        Guid? facilityId = null,
        Guid? departmentId = null,
        DateTime? startDate = null,
        DateTime? endDate = null);
    Task<ShiftDto> CreateAsync(CreateShiftRequest request, Guid userId);
    Task<ShiftDto> UpdateAsync(Guid id, UpdateShiftRequest request, Guid userId);
    Task<bool> DeleteAsync(Guid id, Guid userId);
    Task<ShiftDto> BroadcastAsync(Guid id, BroadcastShiftRequest request, Guid userId);
    Task<ShiftDto> AssignStaffAsync(Guid id, Guid staffId, Guid userId);
    Task<List<ShiftListDto>> GetMyShiftsAsync(Guid userId, ShiftStatus? status = null);
}
