using Microsoft.EntityFrameworkCore;
using StaffGrid.Application.DTOs;
using StaffGrid.Application.Interfaces;
using StaffGrid.Core.Entities;
using StaffGrid.Core.Enums;
using StaffGrid.Infrastructure.Data;

namespace StaffGrid.Infrastructure.Services;

public class ShiftService : IShiftService
{
    private readonly ApplicationDbContext _context;

    public ShiftService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ShiftDto> GetByIdAsync(Guid id)
    {
        var shift = await _context.Shifts
            .Include(s => s.Facility)
            .Include(s => s.Department)
            .Include(s => s.AssignedStaff)
            .Include(s => s.CreatedByUser)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (shift == null)
        {
            throw new KeyNotFoundException($"Shift with ID {id} not found");
        }

        return MapToDto(shift);
    }

    public async Task<(List<ShiftListDto> Shifts, int TotalCount)> GetAllAsync(
        int page = 1,
        int pageSize = 20,
        ShiftStatus? status = null,
        Guid? facilityId = null,
        Guid? departmentId = null,
        DateTime? startDate = null,
        DateTime? endDate = null)
    {
        var query = _context.Shifts
            .Include(s => s.Facility)
            .Include(s => s.Department)
            .Include(s => s.AssignedStaff)
            .AsQueryable();

        // Apply filters
        if (status.HasValue)
        {
            query = query.Where(s => s.Status == status.Value);
        }

        if (facilityId.HasValue)
        {
            query = query.Where(s => s.FacilityId == facilityId.Value);
        }

        if (departmentId.HasValue)
        {
            query = query.Where(s => s.DepartmentId == departmentId.Value);
        }

        if (startDate.HasValue)
        {
            query = query.Where(s => s.StartDateTime >= startDate.Value);
        }

        if (endDate.HasValue)
        {
            query = query.Where(s => s.EndDateTime <= endDate.Value);
        }

        var totalCount = await query.CountAsync();

        var shifts = await query
            .OrderByDescending(s => s.StartDateTime)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(s => new ShiftListDto
            {
                Id = s.Id,
                Title = s.Title,
                StartDateTime = s.StartDateTime,
                EndDateTime = s.EndDateTime,
                ProfessionalType = s.ProfessionalType,
                Status = s.Status,
                IsUrgent = s.IsUrgent,
                FacilityName = s.Facility.Name,
                DepartmentName = s.Department.Name,
                AssignedStaffName = s.AssignedStaff != null ? $"{s.AssignedStaff.FirstName} {s.AssignedStaff.LastName}" : null,
                PayRate = s.PayRate,
                NumberOfStaffNeeded = s.NumberOfStaffNeeded
            })
            .ToListAsync();

        return (shifts, totalCount);
    }

    public async Task<ShiftDto> CreateAsync(CreateShiftRequest request, Guid userId)
    {
        // Validate user and get facility
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            throw new UnauthorizedAccessException("User not found");
        }

        if (user.Role != UserRole.FacilityUser && user.Role != UserRole.SuperAdmin)
        {
            throw new UnauthorizedAccessException("Only facility users can create shifts");
        }

        // Validate department
        var department = await _context.Departments
            .Include(d => d.Facility)
            .FirstOrDefaultAsync(d => d.Id == request.DepartmentId);

        if (department == null)
        {
            throw new ArgumentException("Department not found");
        }

        // For facility users, ensure they can only create shifts for their facility
        if (user.Role == UserRole.FacilityUser && user.FacilityId != department.FacilityId)
        {
            throw new UnauthorizedAccessException("You can only create shifts for your facility");
        }

        var shift = new Shift
        {
            Title = request.Title,
            Description = request.Description,
            StartDateTime = request.StartDateTime,
            EndDateTime = request.EndDateTime,
            ProfessionalType = request.ProfessionalType,
            Specialization = request.Specialization,
            NumberOfStaffNeeded = request.NumberOfStaffNeeded,
            PayRate = request.PayRate,
            IsUrgent = request.IsUrgent,
            Requirements = request.Requirements,
            Notes = request.Notes,
            Status = ShiftStatus.Draft,
            FacilityId = department.FacilityId,
            DepartmentId = request.DepartmentId,
            CreatedByUserId = userId
        };

        _context.Shifts.Add(shift);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(shift.Id);
    }

    public async Task<ShiftDto> UpdateAsync(Guid id, UpdateShiftRequest request, Guid userId)
    {
        var shift = await _context.Shifts
            .Include(s => s.Facility)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (shift == null)
        {
            throw new KeyNotFoundException($"Shift with ID {id} not found");
        }

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            throw new UnauthorizedAccessException("User not found");
        }

        // Authorization check
        if (user.Role == UserRole.FacilityUser && user.FacilityId != shift.FacilityId)
        {
            throw new UnauthorizedAccessException("You can only update shifts for your facility");
        }

        // Update fields if provided
        if (request.Title != null) shift.Title = request.Title;
        if (request.Description != null) shift.Description = request.Description;
        if (request.StartDateTime.HasValue) shift.StartDateTime = request.StartDateTime.Value;
        if (request.EndDateTime.HasValue) shift.EndDateTime = request.EndDateTime.Value;
        if (request.ProfessionalType != null) shift.ProfessionalType = request.ProfessionalType;
        if (request.Specialization != null) shift.Specialization = request.Specialization;
        if (request.NumberOfStaffNeeded.HasValue) shift.NumberOfStaffNeeded = request.NumberOfStaffNeeded.Value;
        if (request.PayRate.HasValue) shift.PayRate = request.PayRate.Value;
        if (request.Status.HasValue) shift.Status = request.Status.Value;
        if (request.IsUrgent.HasValue) shift.IsUrgent = request.IsUrgent.Value;
        if (request.Requirements != null) shift.Requirements = request.Requirements;
        if (request.Notes != null) shift.Notes = request.Notes;
        if (request.DepartmentId.HasValue) shift.DepartmentId = request.DepartmentId.Value;
        if (request.AssignedStaffId.HasValue) shift.AssignedStaffId = request.AssignedStaffId.Value;

        await _context.SaveChangesAsync();

        return await GetByIdAsync(shift.Id);
    }

    public async Task<bool> DeleteAsync(Guid id, Guid userId)
    {
        var shift = await _context.Shifts.FindAsync(id);
        if (shift == null)
        {
            return false;
        }

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            throw new UnauthorizedAccessException("User not found");
        }

        // Authorization check
        if (user.Role == UserRole.FacilityUser && user.FacilityId != shift.FacilityId)
        {
            throw new UnauthorizedAccessException("You can only delete shifts for your facility");
        }

        shift.IsDeleted = true;
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<ShiftDto> BroadcastAsync(Guid id, BroadcastShiftRequest request, Guid userId)
    {
        var shift = await _context.Shifts
            .Include(s => s.Facility)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (shift == null)
        {
            throw new KeyNotFoundException($"Shift with ID {id} not found");
        }

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            throw new UnauthorizedAccessException("User not found");
        }

        // Authorization check
        if (user.Role == UserRole.FacilityUser && user.FacilityId != shift.FacilityId)
        {
            throw new UnauthorizedAccessException("You can only broadcast shifts for your facility");
        }

        if (shift.Status != ShiftStatus.Draft && shift.Status != ShiftStatus.Approved)
        {
            throw new InvalidOperationException("Only draft or approved shifts can be broadcast");
        }

        // Update shift status and broadcast info
        shift.Status = ShiftStatus.Broadcasting;
        shift.BroadcastStartTime = DateTime.UtcNow;
        shift.CurrentBroadcastTier = request.StartFromTier ?? AgencyTier.Tier1;

        // Set tier exclusivity end time (4 hours for Tier1)
        if (shift.CurrentBroadcastTier == AgencyTier.Tier1)
        {
            shift.TierExclusivityEndTime = DateTime.UtcNow.AddHours(4);
        }

        await _context.SaveChangesAsync();

        // TODO: Send notifications to agencies based on tier and facility partnerships
        // This would be implemented in a NotificationService

        return await GetByIdAsync(shift.Id);
    }

    public async Task<ShiftDto> AssignStaffAsync(Guid id, Guid staffId, Guid userId)
    {
        var shift = await _context.Shifts.FindAsync(id);
        if (shift == null)
        {
            throw new KeyNotFoundException($"Shift with ID {id} not found");
        }

        var staff = await _context.Staff.FindAsync(staffId);
        if (staff == null)
        {
            throw new ArgumentException("Staff not found");
        }

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            throw new UnauthorizedAccessException("User not found");
        }

        // Authorization check
        if (user.Role == UserRole.FacilityUser && user.FacilityId != shift.FacilityId)
        {
            throw new UnauthorizedAccessException("You can only assign staff to shifts for your facility");
        }

        shift.AssignedStaffId = staffId;
        shift.Status = ShiftStatus.Assigned;

        await _context.SaveChangesAsync();

        return await GetByIdAsync(shift.Id);
    }

    public async Task<List<ShiftListDto>> GetMyShiftsAsync(Guid userId, ShiftStatus? status = null)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            throw new UnauthorizedAccessException("User not found");
        }

        var query = _context.Shifts
            .Include(s => s.Facility)
            .Include(s => s.Department)
            .Include(s => s.AssignedStaff)
            .AsQueryable();

        // Filter based on user role
        if (user.Role == UserRole.FacilityUser)
        {
            query = query.Where(s => s.FacilityId == user.FacilityId);
        }
        else if (user.Role == UserRole.CorporateAdmin)
        {
            var facilityIds = await _context.Facilities
                .Where(f => f.CorporateId == user.CorporateId)
                .Select(f => f.Id)
                .ToListAsync();
            query = query.Where(s => facilityIds.Contains(s.FacilityId));
        }
        else if (user.Role == UserRole.AgencyUser)
        {
            // Show shifts that are broadcast to this agency's tier or assigned to their staff
            var agencyStaffIds = await _context.Staff
                .Where(st => st.AgencyId == user.AgencyId)
                .Select(st => st.Id)
                .ToListAsync();
            query = query.Where(s => agencyStaffIds.Contains(s.AssignedStaffId ?? Guid.Empty) || s.Status == ShiftStatus.Broadcasting);
        }

        if (status.HasValue)
        {
            query = query.Where(s => s.Status == status.Value);
        }

        return await query
            .OrderByDescending(s => s.StartDateTime)
            .Select(s => new ShiftListDto
            {
                Id = s.Id,
                Title = s.Title,
                StartDateTime = s.StartDateTime,
                EndDateTime = s.EndDateTime,
                ProfessionalType = s.ProfessionalType,
                Status = s.Status,
                IsUrgent = s.IsUrgent,
                FacilityName = s.Facility.Name,
                DepartmentName = s.Department.Name,
                AssignedStaffName = s.AssignedStaff != null ? $"{s.AssignedStaff.FirstName} {s.AssignedStaff.LastName}" : null,
                PayRate = s.PayRate,
                NumberOfStaffNeeded = s.NumberOfStaffNeeded
            })
            .ToListAsync();
    }

    private static ShiftDto MapToDto(Shift shift)
    {
        return new ShiftDto
        {
            Id = shift.Id,
            Title = shift.Title,
            Description = shift.Description,
            StartDateTime = shift.StartDateTime,
            EndDateTime = shift.EndDateTime,
            ProfessionalType = shift.ProfessionalType,
            Specialization = shift.Specialization,
            NumberOfStaffNeeded = shift.NumberOfStaffNeeded,
            PayRate = shift.PayRate,
            Status = shift.Status,
            IsUrgent = shift.IsUrgent,
            Requirements = shift.Requirements,
            Notes = shift.Notes,
            BroadcastStartTime = shift.BroadcastStartTime,
            CurrentBroadcastTier = shift.CurrentBroadcastTier,
            TierExclusivityEndTime = shift.TierExclusivityEndTime,
            FacilityId = shift.FacilityId,
            FacilityName = shift.Facility?.Name,
            DepartmentId = shift.DepartmentId,
            DepartmentName = shift.Department?.Name,
            AssignedStaffId = shift.AssignedStaffId,
            AssignedStaffName = shift.AssignedStaff != null ? $"{shift.AssignedStaff.FirstName} {shift.AssignedStaff.LastName}" : null,
            CreatedByUserId = shift.CreatedByUserId,
            CreatedByUserName = shift.CreatedByUser?.Name,
            CreatedAt = shift.CreatedAt,
            UpdatedAt = shift.UpdatedAt
        };
    }
}
