using Microsoft.EntityFrameworkCore;
using StaffGrid.Application.DTOs;
using StaffGrid.Application.Interfaces;
using StaffGrid.Core.Entities;
using StaffGrid.Infrastructure.Data;

namespace StaffGrid.Infrastructure.Services;

public class CorporateManagementService : ICorporateManagementService
{
    private readonly ApplicationDbContext _context;

    public CorporateManagementService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<CorporateDto>> GetAllCorporatesAsync()
    {
        var corporates = await _context.Corporates
            .Include(c => c.Facilities)
            .Include(c => c.Users)
            .OrderBy(c => c.Name)
            .ToListAsync();

        return corporates.Select(c => new CorporateDto
        {
            Id = c.Id,
            Name = c.Name,
            Address = c.Address,
            City = c.City,
            State = c.State,
            ZipCode = c.ZipCode,
            PhoneNumber = c.PhoneNumber,
            Email = c.Email,
            IsActive = c.IsActive,
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt,
            FacilityCount = c.Facilities.Count,
            UserCount = c.Users.Count
        });
    }

    public async Task<CorporateDto?> GetCorporateByIdAsync(Guid corporateId)
    {
        var corporate = await _context.Corporates
            .Include(c => c.Facilities)
            .Include(c => c.Users)
            .FirstOrDefaultAsync(c => c.Id == corporateId);

        if (corporate == null)
        {
            return null;
        }

        return new CorporateDto
        {
            Id = corporate.Id,
            Name = corporate.Name,
            Address = corporate.Address,
            City = corporate.City,
            State = corporate.State,
            ZipCode = corporate.ZipCode,
            PhoneNumber = corporate.PhoneNumber,
            Email = corporate.Email,
            IsActive = corporate.IsActive,
            CreatedAt = corporate.CreatedAt,
            UpdatedAt = corporate.UpdatedAt,
            FacilityCount = corporate.Facilities.Count,
            UserCount = corporate.Users.Count
        };
    }

    public async Task<CorporateDto> CreateCorporateAsync(CreateCorporateRequest request)
    {
        var corporate = new Corporate
        {
            Name = request.Name,
            Address = request.Address,
            City = request.City,
            State = request.State,
            ZipCode = request.ZipCode,
            PhoneNumber = request.PhoneNumber,
            Email = request.Email,
            IsActive = true
        };

        _context.Corporates.Add(corporate);
        await _context.SaveChangesAsync();

        return new CorporateDto
        {
            Id = corporate.Id,
            Name = corporate.Name,
            Address = corporate.Address,
            City = corporate.City,
            State = corporate.State,
            ZipCode = corporate.ZipCode,
            PhoneNumber = corporate.PhoneNumber,
            Email = corporate.Email,
            IsActive = corporate.IsActive,
            CreatedAt = corporate.CreatedAt,
            UpdatedAt = corporate.UpdatedAt,
            FacilityCount = 0,
            UserCount = 0
        };
    }

    public async Task<bool> UpdateCorporateAsync(Guid corporateId, UpdateCorporateRequest request)
    {
        var corporate = await _context.Corporates.FindAsync(corporateId);
        if (corporate == null)
        {
            return false;
        }

        if (!string.IsNullOrWhiteSpace(request.Name))
        {
            corporate.Name = request.Name;
        }

        if (!string.IsNullOrWhiteSpace(request.Address))
        {
            corporate.Address = request.Address;
        }

        if (request.City != null)
        {
            corporate.City = request.City;
        }

        if (request.State != null)
        {
            corporate.State = request.State;
        }

        if (request.ZipCode != null)
        {
            corporate.ZipCode = request.ZipCode;
        }

        if (request.PhoneNumber != null)
        {
            corporate.PhoneNumber = request.PhoneNumber;
        }

        if (request.Email != null)
        {
            corporate.Email = request.Email;
        }

        if (request.IsActive.HasValue)
        {
            corporate.IsActive = request.IsActive.Value;
        }

        corporate.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteCorporateAsync(Guid corporateId)
    {
        var corporate = await _context.Corporates.FindAsync(corporateId);
        if (corporate == null)
        {
            return false;
        }

        corporate.IsDeleted = true;
        corporate.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return true;
    }
}
