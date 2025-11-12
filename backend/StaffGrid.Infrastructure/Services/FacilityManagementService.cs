using Microsoft.EntityFrameworkCore;
using StaffGrid.Application.DTOs;
using StaffGrid.Application.Interfaces;
using StaffGrid.Core.Entities;
using StaffGrid.Core.Enums;
using StaffGrid.Infrastructure.Data;

namespace StaffGrid.Infrastructure.Services;

public class FacilityManagementService : IFacilityManagementService
{
    private readonly ApplicationDbContext _context;

    public FacilityManagementService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<FacilityDto>> GetAllFacilitiesAsync()
    {
        return await _context.Facilities
            .Include(f => f.Corporate)
            .Include(f => f.Departments)
            .Include(f => f.Users)
            .Include(f => f.Shifts)
            .Select(f => new FacilityDto
            {
                Id = f.Id,
                Name = f.Name,
                Address = f.Address,
                City = f.City,
                State = f.State,
                ZipCode = f.ZipCode,
                PhoneNumber = f.PhoneNumber,
                Email = f.Email,
                IsActive = f.IsActive,
                CorporateId = f.CorporateId,
                CorporateName = f.Corporate != null ? f.Corporate.Name : null,
                CreatedAt = f.CreatedAt,
                UpdatedAt = f.UpdatedAt,
                DepartmentCount = f.Departments.Count,
                UserCount = f.Users.Count,
                ActiveShiftCount = f.Shifts.Count(s => s.Status == ShiftStatus.Approved || s.Status == ShiftStatus.Broadcasting)
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<FacilityDto>> GetFacilitiesByCorporateAsync(Guid corporateId)
    {
        return await _context.Facilities
            .Where(f => f.CorporateId == corporateId)
            .Include(f => f.Corporate)
            .Include(f => f.Departments)
            .Include(f => f.Users)
            .Include(f => f.Shifts)
            .Select(f => new FacilityDto
            {
                Id = f.Id,
                Name = f.Name,
                Address = f.Address,
                City = f.City,
                State = f.State,
                ZipCode = f.ZipCode,
                PhoneNumber = f.PhoneNumber,
                Email = f.Email,
                IsActive = f.IsActive,
                CorporateId = f.CorporateId,
                CorporateName = f.Corporate != null ? f.Corporate.Name : null,
                CreatedAt = f.CreatedAt,
                UpdatedAt = f.UpdatedAt,
                DepartmentCount = f.Departments.Count,
                UserCount = f.Users.Count,
                ActiveShiftCount = f.Shifts.Count(s => s.Status == ShiftStatus.Approved || s.Status == ShiftStatus.Broadcasting)
            })
            .ToListAsync();
    }

    public async Task<FacilityDto?> GetFacilityByIdAsync(Guid facilityId)
    {
        return await _context.Facilities
            .Include(f => f.Corporate)
            .Include(f => f.Departments)
            .Include(f => f.Users)
            .Include(f => f.Shifts)
            .Where(f => f.Id == facilityId)
            .Select(f => new FacilityDto
            {
                Id = f.Id,
                Name = f.Name,
                Address = f.Address,
                City = f.City,
                State = f.State,
                ZipCode = f.ZipCode,
                PhoneNumber = f.PhoneNumber,
                Email = f.Email,
                IsActive = f.IsActive,
                CorporateId = f.CorporateId,
                CorporateName = f.Corporate != null ? f.Corporate.Name : null,
                CreatedAt = f.CreatedAt,
                UpdatedAt = f.UpdatedAt,
                DepartmentCount = f.Departments.Count,
                UserCount = f.Users.Count,
                ActiveShiftCount = f.Shifts.Count(s => s.Status == ShiftStatus.Approved || s.Status == ShiftStatus.Broadcasting)
            })
            .FirstOrDefaultAsync();
    }

    public async Task<FacilityDto> CreateFacilityAsync(CreateFacilityRequest request)
    {
        var facility = new Facility
        {
            Name = request.Name,
            Address = request.Address,
            City = request.City,
            State = request.State,
            ZipCode = request.ZipCode,
            PhoneNumber = request.PhoneNumber,
            Email = request.Email,
            CorporateId = request.CorporateId,
            IsActive = true
        };

        _context.Facilities.Add(facility);
        await _context.SaveChangesAsync();

        return await GetFacilityByIdAsync(facility.Id) ?? throw new Exception("Failed to retrieve created facility");
    }

    public async Task<bool> UpdateFacilityAsync(Guid facilityId, UpdateFacilityRequest request)
    {
        var facility = await _context.Facilities.FindAsync(facilityId);
        if (facility == null)
        {
            return false;
        }

        if (request.Name != null)
            facility.Name = request.Name;

        if (request.Address != null)
            facility.Address = request.Address;

        if (request.City != null)
            facility.City = request.City;

        if (request.State != null)
            facility.State = request.State;

        if (request.ZipCode != null)
            facility.ZipCode = request.ZipCode;

        if (request.PhoneNumber != null)
            facility.PhoneNumber = request.PhoneNumber;

        if (request.Email != null)
            facility.Email = request.Email;

        if (request.IsActive.HasValue)
            facility.IsActive = request.IsActive.Value;

        if (request.CorporateId.HasValue)
            facility.CorporateId = request.CorporateId;

        facility.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteFacilityAsync(Guid facilityId)
    {
        var facility = await _context.Facilities.FindAsync(facilityId);
        if (facility == null)
        {
            return false;
        }

        facility.IsDeleted = true;
        await _context.SaveChangesAsync();
        return true;
    }
}
