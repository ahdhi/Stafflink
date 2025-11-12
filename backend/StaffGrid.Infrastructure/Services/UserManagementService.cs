using Microsoft.EntityFrameworkCore;
using StaffGrid.Application.DTOs;
using StaffGrid.Application.Interfaces;
using StaffGrid.Core.Enums;
using StaffGrid.Infrastructure.Data;

namespace StaffGrid.Infrastructure.Services;

public class UserManagementService : IUserManagementService
{
    private readonly ApplicationDbContext _context;

    public UserManagementService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<UserListDto>> GetAllUsersAsync(UserRole? role = null, ApprovalStatus? status = null)
    {
        var query = _context.Users
            .Include(u => u.Corporate)
            .Include(u => u.Facility)
            .Include(u => u.Agency)
            .AsQueryable();

        if (role.HasValue)
        {
            query = query.Where(u => u.Role == role.Value);
        }

        if (status.HasValue)
        {
            query = query.Where(u => u.ApprovalStatus == status.Value);
        }

        var users = await query
            .OrderByDescending(u => u.CreatedAt)
            .ToListAsync();

        return users.Select(u => new UserListDto
        {
            Id = u.Id,
            Email = u.Email,
            Name = u.Name,
            Role = u.Role,
            IsActive = u.IsActive,
            ApprovalStatus = u.ApprovalStatus,
            CreatedAt = u.CreatedAt,
            CorporateName = u.Corporate?.Name,
            FacilityName = u.Facility?.Name,
            AgencyName = u.Agency?.Name
        });
    }

    public async Task<IEnumerable<UserListDto>> GetPendingApprovalsAsync()
    {
        return await GetAllUsersAsync(null, ApprovalStatus.Pending);
    }

    public async Task<UserDetailsDto?> GetUserByIdAsync(Guid userId)
    {
        var user = await _context.Users
            .Include(u => u.Corporate)
            .Include(u => u.Facility)
            .Include(u => u.Agency)
            .Include(u => u.Approver)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return null;
        }

        return new UserDetailsDto
        {
            Id = user.Id,
            Email = user.Email,
            Name = user.Name,
            Role = user.Role,
            PhoneNumber = user.PhoneNumber,
            IsActive = user.IsActive,
            ApprovalStatus = user.ApprovalStatus,
            ApprovedBy = user.ApprovedBy,
            ApproverName = user.Approver?.Name,
            ApprovedAt = user.ApprovedAt,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt,
            CorporateId = user.CorporateId,
            CorporateName = user.Corporate?.Name,
            FacilityId = user.FacilityId,
            FacilityName = user.Facility?.Name,
            AgencyId = user.AgencyId,
            AgencyName = user.Agency?.Name
        };
    }

    public async Task<bool> ApproveUserAsync(Guid userId, Guid approverId, ApproveUserRequest request)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return false;
        }

        user.ApprovalStatus = ApprovalStatus.Approved;
        user.ApprovedBy = approverId;
        user.ApprovedAt = DateTime.UtcNow;
        user.IsActive = true;
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // TODO: Send notification to user about approval
        // await _notificationService.SendUserApprovedNotification(user);

        return true;
    }

    public async Task<bool> RejectUserAsync(Guid userId, Guid approverId, RejectUserRequest request)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return false;
        }

        user.ApprovalStatus = ApprovalStatus.Rejected;
        user.ApprovedBy = approverId;
        user.ApprovedAt = DateTime.UtcNow;
        user.IsActive = false;
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // TODO: Send notification to user about rejection with reason
        // await _notificationService.SendUserRejectedNotification(user, request.Reason);

        return true;
    }

    public async Task<bool> UpdateUserAsync(Guid userId, UpdateUserRequest request)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return false;
        }

        if (!string.IsNullOrWhiteSpace(request.Name))
        {
            user.Name = request.Name;
        }

        if (!string.IsNullOrWhiteSpace(request.Email))
        {
            // Check if email is already in use by another user
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.ToLower() && u.Id != userId);

            if (existingUser != null)
            {
                throw new InvalidOperationException("Email is already in use");
            }

            user.Email = request.Email;
        }

        if (request.PhoneNumber != null)
        {
            user.PhoneNumber = request.PhoneNumber;
        }

        if (request.Role.HasValue)
        {
            user.Role = request.Role.Value;
        }

        if (request.IsActive.HasValue)
        {
            user.IsActive = request.IsActive.Value;
        }

        if (request.CorporateId.HasValue)
        {
            user.CorporateId = request.CorporateId.Value;
        }

        if (request.FacilityId.HasValue)
        {
            user.FacilityId = request.FacilityId.Value;
        }

        if (request.AgencyId.HasValue)
        {
            user.AgencyId = request.AgencyId.Value;
        }

        user.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeactivateUserAsync(Guid userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return false;
        }

        user.IsActive = false;
        user.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> ActivateUserAsync(Guid userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return false;
        }

        user.IsActive = true;
        user.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return true;
    }
}
