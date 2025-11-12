using Microsoft.EntityFrameworkCore;
using StaffGrid.Application.DTOs;
using StaffGrid.Application.Interfaces;
using StaffGrid.Core.Entities;
using StaffGrid.Core.Enums;
using StaffGrid.Infrastructure.Data;

namespace StaffGrid.Infrastructure.Services;

public class UserCreationRequestService : IUserCreationRequestService
{
    private readonly ApplicationDbContext _context;

    public UserCreationRequestService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<UserCreationRequestDto>> GetAllRequestsAsync()
    {
        return await _context.UserCreationRequests
            .Include(ucr => ucr.RequestedByUser)
            .Include(ucr => ucr.ApprovedByUser)
            .Include(ucr => ucr.Corporate)
            .Include(ucr => ucr.Facility)
            .Include(ucr => ucr.Agency)
            .Include(ucr => ucr.CreatedUser)
            .Select(ucr => MapToDto(ucr))
            .ToListAsync();
    }

    public async Task<IEnumerable<UserCreationRequestDto>> GetPendingRequestsAsync()
    {
        return await _context.UserCreationRequests
            .Where(ucr => ucr.ApprovalStatus == ApprovalStatus.Pending)
            .Include(ucr => ucr.RequestedByUser)
            .Include(ucr => ucr.Corporate)
            .Include(ucr => ucr.Facility)
            .Include(ucr => ucr.Agency)
            .Select(ucr => MapToDto(ucr))
            .ToListAsync();
    }

    public async Task<IEnumerable<UserCreationRequestDto>> GetRequestsByCorporateAsync(Guid corporateId)
    {
        return await _context.UserCreationRequests
            .Where(ucr => ucr.CorporateId == corporateId)
            .Include(ucr => ucr.RequestedByUser)
            .Include(ucr => ucr.ApprovedByUser)
            .Include(ucr => ucr.Corporate)
            .Include(ucr => ucr.Facility)
            .Include(ucr => ucr.Agency)
            .Include(ucr => ucr.CreatedUser)
            .Select(ucr => MapToDto(ucr))
            .ToListAsync();
    }

    public async Task<UserCreationRequestDto?> GetRequestByIdAsync(Guid requestId)
    {
        var request = await _context.UserCreationRequests
            .Include(ucr => ucr.RequestedByUser)
            .Include(ucr => ucr.ApprovedByUser)
            .Include(ucr => ucr.Corporate)
            .Include(ucr => ucr.Facility)
            .Include(ucr => ucr.Agency)
            .Include(ucr => ucr.CreatedUser)
            .FirstOrDefaultAsync(ucr => ucr.Id == requestId);

        return request != null ? MapToDto(request) : null;
    }

    public async Task<UserCreationRequestDto> CreateRequestAsync(Guid requestedById, CreateUserCreationRequest request)
    {
        var userCreationRequest = new UserCreationRequest
        {
            Name = request.Name,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
            Role = request.Role,
            RequestedBy = requestedById,
            CorporateId = request.CorporateId,
            FacilityId = request.FacilityId,
            AgencyId = request.AgencyId,
            Notes = request.Notes,
            ApprovalStatus = ApprovalStatus.Pending
        };

        _context.UserCreationRequests.Add(userCreationRequest);
        await _context.SaveChangesAsync();

        return await GetRequestByIdAsync(userCreationRequest.Id) ?? throw new Exception("Failed to retrieve created request");
    }

    public async Task<bool> ApproveRequestAsync(Guid requestId, Guid approverId, ApproveUserCreationRequestDto approveDto)
    {
        var request = await _context.UserCreationRequests.FindAsync(requestId);
        if (request == null || request.ApprovalStatus != ApprovalStatus.Pending)
        {
            return false;
        }

        // Create the user
        var temporaryPassword = GenerateTemporaryPassword();
        var user = new User
        {
            Email = request.Email,
            Name = request.Name,
            PhoneNumber = request.PhoneNumber,
            Role = request.Role,
            PasswordHash = temporaryPassword, // In production: BCrypt.Net.BCrypt.HashPassword(temporaryPassword)
            CorporateId = request.CorporateId,
            FacilityId = request.FacilityId,
            AgencyId = request.AgencyId,
            ApprovalStatus = ApprovalStatus.Approved,
            ApprovedBy = approverId,
            ApprovedAt = DateTime.UtcNow,
            IsActive = true
        };

        _context.Users.Add(user);

        // Update the request
        request.ApprovalStatus = ApprovalStatus.Approved;
        request.ApprovedBy = approverId;
        request.ApprovedAt = DateTime.UtcNow;
        request.CreatedUserId = user.Id;
        if (!string.IsNullOrEmpty(approveDto.Notes))
        {
            request.Notes = string.IsNullOrEmpty(request.Notes)
                ? approveDto.Notes
                : $"{request.Notes}\n\nApproval Notes: {approveDto.Notes}";
        }

        await _context.SaveChangesAsync();

        // TODO: Send email to user with temporary password
        // This would be implemented in a separate EmailService

        return true;
    }

    public async Task<bool> RejectRequestAsync(Guid requestId, Guid approverId, RejectUserCreationRequestDto rejectDto)
    {
        var request = await _context.UserCreationRequests.FindAsync(requestId);
        if (request == null || request.ApprovalStatus != ApprovalStatus.Pending)
        {
            return false;
        }

        request.ApprovalStatus = ApprovalStatus.Rejected;
        request.ApprovedBy = approverId;
        request.ApprovedAt = DateTime.UtcNow;
        request.RejectionReason = rejectDto.Reason;

        await _context.SaveChangesAsync();
        return true;
    }

    private static UserCreationRequestDto MapToDto(UserCreationRequest ucr)
    {
        return new UserCreationRequestDto
        {
            Id = ucr.Id,
            Name = ucr.Name,
            Email = ucr.Email,
            PhoneNumber = ucr.PhoneNumber,
            Role = ucr.Role,
            ApprovalStatus = ucr.ApprovalStatus,
            RequestedBy = ucr.RequestedBy,
            RequestedByName = ucr.RequestedByUser?.Name,
            ApprovedBy = ucr.ApprovedBy,
            ApprovedByName = ucr.ApprovedByUser?.Name,
            CorporateId = ucr.CorporateId,
            CorporateName = ucr.Corporate?.Name,
            FacilityId = ucr.FacilityId,
            FacilityName = ucr.Facility?.Name,
            AgencyId = ucr.AgencyId,
            AgencyName = ucr.Agency?.Name,
            ApprovedAt = ucr.ApprovedAt,
            RejectionReason = ucr.RejectionReason,
            Notes = ucr.Notes,
            CreatedUserId = ucr.CreatedUserId,
            CreatedAt = ucr.CreatedAt
        };
    }

    private static string GenerateTemporaryPassword()
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        var random = new Random();
        return new string(Enumerable.Repeat(chars, 12)
            .Select(s => s[random.Next(s.Length)]).ToArray());
    }
}
