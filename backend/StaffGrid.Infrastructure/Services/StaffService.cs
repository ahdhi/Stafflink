using Microsoft.EntityFrameworkCore;
using StaffGrid.Application.DTOs;
using StaffGrid.Application.Interfaces;
using StaffGrid.Core.Entities;
using StaffGrid.Core.Enums;
using StaffGrid.Infrastructure.Data;

namespace StaffGrid.Infrastructure.Services;

public class StaffService : IStaffService
{
    private readonly ApplicationDbContext _context;

    public StaffService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<StaffDto> GetByIdAsync(Guid id)
    {
        var staff = await _context.Staff
            .Include(s => s.Agency)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (staff == null)
        {
            throw new KeyNotFoundException($"Staff with ID {id} not found");
        }

        return MapToDto(staff);
    }

    public async Task<(List<StaffDto> Staff, int TotalCount)> GetAllAsync(
        int page = 1,
        int pageSize = 20,
        Guid? agencyId = null,
        string? professionalType = null,
        bool? isAvailable = null)
    {
        var query = _context.Staff
            .Include(s => s.Agency)
            .AsQueryable();

        if (agencyId.HasValue)
        {
            query = query.Where(s => s.AgencyId == agencyId.Value);
        }

        if (!string.IsNullOrEmpty(professionalType))
        {
            query = query.Where(s => s.ProfessionalType == professionalType);
        }

        if (isAvailable.HasValue)
        {
            query = query.Where(s => s.IsAvailable == isAvailable.Value);
        }

        var totalCount = await query.CountAsync();

        var staff = await query
            .OrderBy(s => s.LastName)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(s => MapToDto(s))
            .ToListAsync();

        return (staff, totalCount);
    }

    public async Task<StaffDto> CreateAsync(CreateStaffRequest request, Guid userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null || user.Role != UserRole.AgencyUser)
        {
            throw new UnauthorizedAccessException("Only agency users can create staff");
        }

        var staff = new Staff
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
            Address = request.Address,
            City = request.City,
            State = request.State,
            ZipCode = request.ZipCode,
            DateOfBirth = request.DateOfBirth,
            LicenseNumber = request.LicenseNumber,
            LicenseExpiryDate = request.LicenseExpiryDate,
            ProfessionalType = request.ProfessionalType,
            Specialization = request.Specialization,
            YearsOfExperience = request.YearsOfExperience,
            HourlyRate = request.HourlyRate,
            AgencyId = user.AgencyId!.Value,
            IsActive = true,
            IsAvailable = true
        };

        _context.Staff.Add(staff);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(staff.Id);
    }

    public async Task<StaffDto> UpdateAsync(Guid id, CreateStaffRequest request, Guid userId)
    {
        var staff = await _context.Staff.FindAsync(id);
        if (staff == null)
        {
            throw new KeyNotFoundException($"Staff with ID {id} not found");
        }

        var user = await _context.Users.FindAsync(userId);
        if (user == null || (user.Role == UserRole.AgencyUser && user.AgencyId != staff.AgencyId))
        {
            throw new UnauthorizedAccessException("You can only update staff in your agency");
        }

        staff.FirstName = request.FirstName;
        staff.LastName = request.LastName;
        staff.Email = request.Email;
        staff.PhoneNumber = request.PhoneNumber;
        staff.Address = request.Address;
        staff.City = request.City;
        staff.State = request.State;
        staff.ZipCode = request.ZipCode;
        staff.DateOfBirth = request.DateOfBirth;
        staff.LicenseNumber = request.LicenseNumber;
        staff.LicenseExpiryDate = request.LicenseExpiryDate;
        staff.ProfessionalType = request.ProfessionalType;
        staff.Specialization = request.Specialization;
        staff.YearsOfExperience = request.YearsOfExperience;
        staff.HourlyRate = request.HourlyRate;

        await _context.SaveChangesAsync();

        return await GetByIdAsync(staff.Id);
    }

    public async Task<bool> DeleteAsync(Guid id, Guid userId)
    {
        var staff = await _context.Staff.FindAsync(id);
        if (staff == null)
        {
            return false;
        }

        var user = await _context.Users.FindAsync(userId);
        if (user == null || (user.Role == UserRole.AgencyUser && user.AgencyId != staff.AgencyId))
        {
            throw new UnauthorizedAccessException("You can only delete staff in your agency");
        }

        staff.IsDeleted = true;
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<List<StaffDto>> GetMyStaffAsync(Guid userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null || user.AgencyId == null)
        {
            throw new UnauthorizedAccessException("User not found or not associated with an agency");
        }

        var staff = await _context.Staff
            .Include(s => s.Agency)
            .Where(s => s.AgencyId == user.AgencyId.Value)
            .OrderBy(s => s.LastName)
            .Select(s => MapToDto(s))
            .ToListAsync();

        return staff;
    }

    private static StaffDto MapToDto(Staff staff)
    {
        return new StaffDto
        {
            Id = staff.Id,
            FirstName = staff.FirstName,
            LastName = staff.LastName,
            Email = staff.Email,
            PhoneNumber = staff.PhoneNumber,
            Address = staff.Address,
            City = staff.City,
            State = staff.State,
            ZipCode = staff.ZipCode,
            DateOfBirth = staff.DateOfBirth,
            LicenseNumber = staff.LicenseNumber,
            LicenseExpiryDate = staff.LicenseExpiryDate,
            ProfessionalType = staff.ProfessionalType,
            Specialization = staff.Specialization,
            YearsOfExperience = staff.YearsOfExperience,
            HourlyRate = staff.HourlyRate,
            IsActive = staff.IsActive,
            IsAvailable = staff.IsAvailable,
            AgencyId = staff.AgencyId,
            AgencyName = staff.Agency?.Name,
            AverageRating = staff.AverageRating,
            TotalShiftsCompleted = staff.TotalShiftsCompleted,
            NoShowCount = staff.NoShowCount
        };
    }
}
