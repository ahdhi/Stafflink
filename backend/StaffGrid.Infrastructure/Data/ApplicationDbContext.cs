using Microsoft.EntityFrameworkCore;
using StaffGrid.Core.Entities;

namespace StaffGrid.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // DbSets
    public DbSet<User> Users => Set<User>();
    public DbSet<Corporate> Corporates => Set<Corporate>();
    public DbSet<Facility> Facilities => Set<Facility>();
    public DbSet<Department> Departments => Set<Department>();
    public DbSet<Agency> Agencies => Set<Agency>();
    public DbSet<FacilityAgency> FacilityAgencies => Set<FacilityAgency>();
    public DbSet<Staff> Staff => Set<Staff>();
    public DbSet<Certification> Certifications => Set<Certification>();
    public DbSet<StaffAvailability> StaffAvailabilities => Set<StaffAvailability>();
    public DbSet<Shift> Shifts => Set<Shift>();
    public DbSet<ShiftResponse> ShiftResponses => Set<ShiftResponse>();
    public DbSet<Notification> Notifications => Set<Notification>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply configurations
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

        // Global query filter for soft deletes
        modelBuilder.Entity<User>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Corporate>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Facility>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Department>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Agency>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<FacilityAgency>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Staff>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Certification>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<StaffAvailability>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Shift>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<ShiftResponse>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Notification>().HasQueryFilter(e => !e.IsDeleted);

        // Configure relationships
        ConfigureUserRelationships(modelBuilder);
        ConfigureFacilityAgencyRelationships(modelBuilder);
        ConfigureShiftRelationships(modelBuilder);
    }

    private void ConfigureUserRelationships(ModelBuilder modelBuilder)
    {
        // User self-referencing relationship for Approver
        modelBuilder.Entity<User>()
            .HasOne(u => u.Approver)
            .WithMany(u => u.ApprovedUsers)
            .HasForeignKey(u => u.ApprovedBy)
            .OnDelete(DeleteBehavior.Restrict);

        // User -> Corporate (optional)
        modelBuilder.Entity<User>()
            .HasOne(u => u.Corporate)
            .WithMany(c => c.Users)
            .HasForeignKey(u => u.CorporateId)
            .OnDelete(DeleteBehavior.Restrict);

        // User -> Facility (optional)
        modelBuilder.Entity<User>()
            .HasOne(u => u.Facility)
            .WithMany(f => f.Users)
            .HasForeignKey(u => u.FacilityId)
            .OnDelete(DeleteBehavior.Restrict);

        // User -> Agency (optional)
        modelBuilder.Entity<User>()
            .HasOne(u => u.Agency)
            .WithMany(a => a.Users)
            .HasForeignKey(u => u.AgencyId)
            .OnDelete(DeleteBehavior.Restrict);
    }

    private void ConfigureFacilityAgencyRelationships(ModelBuilder modelBuilder)
    {
        // FacilityAgency composite key
        modelBuilder.Entity<FacilityAgency>()
            .HasKey(fa => new { fa.FacilityId, fa.AgencyId });

        // Many-to-many through FacilityAgency
        modelBuilder.Entity<FacilityAgency>()
            .HasOne(fa => fa.Facility)
            .WithMany(f => f.FacilityAgencies)
            .HasForeignKey(fa => fa.FacilityId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<FacilityAgency>()
            .HasOne(fa => fa.Agency)
            .WithMany(a => a.FacilityAgencies)
            .HasForeignKey(fa => fa.AgencyId)
            .OnDelete(DeleteBehavior.Cascade);
    }

    private void ConfigureShiftRelationships(ModelBuilder modelBuilder)
    {
        // Shift -> AssignedStaff (optional)
        modelBuilder.Entity<Shift>()
            .HasOne(s => s.AssignedStaff)
            .WithMany(st => st.Shifts)
            .HasForeignKey(s => s.AssignedStaffId)
            .OnDelete(DeleteBehavior.SetNull);

        // Shift -> CreatedByUser
        modelBuilder.Entity<Shift>()
            .HasOne(s => s.CreatedByUser)
            .WithMany()
            .HasForeignKey(s => s.CreatedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Shift -> Facility
        modelBuilder.Entity<Shift>()
            .HasOne(s => s.Facility)
            .WithMany(f => f.Shifts)
            .HasForeignKey(s => s.FacilityId)
            .OnDelete(DeleteBehavior.Cascade);

        // Shift -> Department
        modelBuilder.Entity<Shift>()
            .HasOne(s => s.Department)
            .WithMany(d => d.Shifts)
            .HasForeignKey(s => s.DepartmentId)
            .OnDelete(DeleteBehavior.Restrict);

        // ShiftResponse -> ProposedStaff (optional)
        modelBuilder.Entity<ShiftResponse>()
            .HasOne(sr => sr.ProposedStaff)
            .WithMany()
            .HasForeignKey(sr => sr.ProposedStaffId)
            .OnDelete(DeleteBehavior.SetNull);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    public override int SaveChanges()
    {
        UpdateTimestamps();
        return base.SaveChanges();
    }

    private void UpdateTimestamps()
    {
        var entries = ChangeTracker.Entries<BaseEntity>();

        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = DateTime.UtcNow;
                entry.Entity.UpdatedAt = DateTime.UtcNow;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = DateTime.UtcNow;
            }
        }
    }
}
