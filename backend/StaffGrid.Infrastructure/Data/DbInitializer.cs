using Microsoft.EntityFrameworkCore;
using StaffGrid.Core.Entities;
using StaffGrid.Core.Enums;

namespace StaffGrid.Infrastructure.Data;

public static class DbInitializer
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // Check if database is already seeded
        if (await context.Users.AnyAsync())
        {
            return; // Database has been seeded
        }

        // Create demo corporates
        var corporate = new Corporate
        {
            Name = "Healthcare Corp Inc.",
            Address = "123 Corporate Blvd",
            City = "New York",
            State = "NY",
            ZipCode = "10001",
            PhoneNumber = "555-0100",
            Email = "contact@healthcarecorp.com",
            IsActive = true
        };

        context.Corporates.Add(corporate);
        await context.SaveChangesAsync();

        // Create demo facility
        var facility = new Facility
        {
            Name = "Central Hospital",
            Address = "456 Hospital Street",
            City = "New York",
            State = "NY",
            ZipCode = "10002",
            PhoneNumber = "555-0200",
            Email = "contact@centralhospital.com",
            CorporateId = corporate.Id,
            IsActive = true
        };

        context.Facilities.Add(facility);
        await context.SaveChangesAsync();

        // Create demo department
        var department = new Department
        {
            Name = "Emergency Department",
            Code = "ED",
            Description = "24/7 Emergency care",
            FacilityId = facility.Id,
            IsActive = true
        };

        context.Departments.Add(department);
        await context.SaveChangesAsync();

        // Create demo agency
        var agency = new Agency
        {
            Name = "StaffPro Agency",
            Address = "789 Agency Ave",
            City = "New York",
            State = "NY",
            ZipCode = "10003",
            PhoneNumber = "555-0300",
            Email = "contact@staffproagency.com",
            LicenseNumber = "AG-2024-001",
            IsActive = true
        };

        context.Agencies.Add(agency);
        await context.SaveChangesAsync();

        // Create facility-agency relationship
        var facilityAgency = new FacilityAgency
        {
            FacilityId = facility.Id,
            AgencyId = agency.Id,
            Tier = AgencyTier.Tier1,
            IsActive = true,
            PartnershipStartDate = DateTime.UtcNow
        };

        context.FacilityAgencies.Add(facilityAgency);
        await context.SaveChangesAsync();

        // Create demo users
        // Note: Using simple password hashing for demo - use BCrypt in production!
        var users = new List<User>
        {
            new User
            {
                Email = "admin@staffgrid.com",
                PasswordHash = "password", // In production: BCrypt.Net.BCrypt.HashPassword("password")
                Name = "Super Admin",
                Role = UserRole.SuperAdmin,
                PhoneNumber = "555-0001",
                IsActive = true,
                ApprovalStatus = ApprovalStatus.Approved,
                ApprovedAt = DateTime.UtcNow
            },
            new User
            {
                Email = "corporate@staffgrid.com",
                PasswordHash = "password",
                Name = "Corporate Admin",
                Role = UserRole.CorporateAdmin,
                PhoneNumber = "555-0002",
                IsActive = true,
                ApprovalStatus = ApprovalStatus.Approved,
                CorporateId = corporate.Id,
                ApprovedAt = DateTime.UtcNow
            },
            new User
            {
                Email = "facility@staffgrid.com",
                PasswordHash = "password",
                Name = "Facility Manager",
                Role = UserRole.FacilityUser,
                PhoneNumber = "555-0003",
                IsActive = true,
                ApprovalStatus = ApprovalStatus.Approved,
                FacilityId = facility.Id,
                ApprovedAt = DateTime.UtcNow
            },
            new User
            {
                Email = "agency@staffgrid.com",
                PasswordHash = "password",
                Name = "Agency Manager",
                Role = UserRole.AgencyUser,
                PhoneNumber = "555-0004",
                IsActive = true,
                ApprovalStatus = ApprovalStatus.Approved,
                AgencyId = agency.Id,
                ApprovedAt = DateTime.UtcNow
            }
        };

        context.Users.AddRange(users);
        await context.SaveChangesAsync();

        // Create demo staff
        var staff = new Staff
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "john.doe@example.com",
            PhoneNumber = "555-1001",
            Address = "123 Nurse Lane",
            City = "New York",
            State = "NY",
            ZipCode = "10004",
            DateOfBirth = new DateTime(1990, 5, 15),
            LicenseNumber = "RN-123456",
            LicenseExpiryDate = DateTime.UtcNow.AddYears(2),
            ProfessionalType = "RN",
            Specialization = "Emergency Care",
            YearsOfExperience = 5,
            HourlyRate = 45.00,
            AgencyId = agency.Id,
            IsActive = true,
            IsAvailable = true
        };

        context.Staff.Add(staff);
        await context.SaveChangesAsync();

        Console.WriteLine("Database seeded successfully with demo data!");
    }
}
