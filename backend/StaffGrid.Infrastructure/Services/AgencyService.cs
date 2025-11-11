using Microsoft.EntityFrameworkCore;
using StaffGrid.Application.DTOs;
using StaffGrid.Application.Interfaces;
using StaffGrid.Core.Enums;
using StaffGrid.Infrastructure.Data;

namespace StaffGrid.Infrastructure.Services;

public class AgencyService : IAgencyService
{
    private readonly ApplicationDbContext _context;

    public AgencyService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<AgencyDto> GetByIdAsync(Guid id)
    {
        var agency = await _context.Agencies
            .Include(a => a.Staff)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (agency == null)
        {
            throw new KeyNotFoundException($"Agency with ID {id} not found");
        }

        return new AgencyDto
        {
            Id = agency.Id,
            Name = agency.Name,
            Address = agency.Address,
            City = agency.City,
            State = agency.State,
            ZipCode = agency.ZipCode,
            PhoneNumber = agency.PhoneNumber,
            Email = agency.Email,
            LicenseNumber = agency.LicenseNumber,
            IsActive = agency.IsActive,
            FillRate = agency.FillRate,
            AverageResponseTime = agency.AverageResponseTime,
            TotalShiftsCompleted = agency.TotalShiftsCompleted,
            AverageRating = agency.AverageRating,
            StaffCount = agency.Staff.Count
        };
    }

    public async Task<(List<AgencyDto> Agencies, int TotalCount)> GetAllAsync(int page = 1, int pageSize = 20)
    {
        var query = _context.Agencies
            .Include(a => a.Staff)
            .Where(a => a.IsActive)
            .AsQueryable();

        var totalCount = await query.CountAsync();

        var agencies = await query
            .OrderBy(a => a.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(a => new AgencyDto
            {
                Id = a.Id,
                Name = a.Name,
                Address = a.Address,
                City = a.City,
                State = a.State,
                ZipCode = a.ZipCode,
                PhoneNumber = a.PhoneNumber,
                Email = a.Email,
                LicenseNumber = a.LicenseNumber,
                IsActive = a.IsActive,
                FillRate = a.FillRate,
                AverageResponseTime = a.AverageResponseTime,
                TotalShiftsCompleted = a.TotalShiftsCompleted,
                AverageRating = a.AverageRating,
                StaffCount = a.Staff.Count
            })
            .ToListAsync();

        return (agencies, totalCount);
    }

    public async Task<List<AgencyDto>> GetMyAgenciesAsync(Guid userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            throw new UnauthorizedAccessException("User not found");
        }

        var query = _context.Agencies
            .Include(a => a.Staff)
            .AsQueryable();

        // For facility users, get agencies partnered with their facility
        if (user.Role == UserRole.FacilityUser && user.FacilityId.HasValue)
        {
            query = query
                .Where(a => a.FacilityAgencies.Any(fa => fa.FacilityId == user.FacilityId.Value));
        }
        // For agency users, get their own agency
        else if (user.Role == UserRole.AgencyUser && user.AgencyId.HasValue)
        {
            query = query.Where(a => a.Id == user.AgencyId.Value);
        }

        var agencies = await query
            .OrderBy(a => a.Name)
            .Select(a => new AgencyDto
            {
                Id = a.Id,
                Name = a.Name,
                Address = a.Address,
                City = a.City,
                State = a.State,
                ZipCode = a.ZipCode,
                PhoneNumber = a.PhoneNumber,
                Email = a.Email,
                LicenseNumber = a.LicenseNumber,
                IsActive = a.IsActive,
                FillRate = a.FillRate,
                AverageResponseTime = a.AverageResponseTime,
                TotalShiftsCompleted = a.TotalShiftsCompleted,
                AverageRating = a.AverageRating,
                StaffCount = a.Staff.Count
            })
            .ToListAsync();

        return agencies;
    }
}
