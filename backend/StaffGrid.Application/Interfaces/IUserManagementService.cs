using StaffGrid.Application.DTOs;
using StaffGrid.Core.Enums;

namespace StaffGrid.Application.Interfaces;

public interface IUserManagementService
{
    Task<IEnumerable<UserListDto>> GetAllUsersAsync(UserRole? role = null, ApprovalStatus? status = null);
    Task<IEnumerable<UserListDto>> GetPendingApprovalsAsync();
    Task<UserDetailsDto?> GetUserByIdAsync(Guid userId);
    Task<bool> ApproveUserAsync(Guid userId, Guid approverId, ApproveUserRequest request);
    Task<bool> RejectUserAsync(Guid userId, Guid approverId, RejectUserRequest request);
    Task<bool> UpdateUserAsync(Guid userId, UpdateUserRequest request);
    Task<bool> DeactivateUserAsync(Guid userId);
    Task<bool> ActivateUserAsync(Guid userId);
}
