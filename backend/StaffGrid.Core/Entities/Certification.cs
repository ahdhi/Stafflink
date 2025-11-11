namespace StaffGrid.Core.Entities;

public class Certification : BaseEntity
{
    public required string Name { get; set; }
    public string? IssuingOrganization { get; set; }
    public required string CertificationNumber { get; set; }
    public DateTime IssueDate { get; set; }
    public DateTime ExpiryDate { get; set; }
    public string? DocumentUrl { get; set; }
    public bool IsVerified { get; set; } = false;

    // Foreign keys
    public Guid StaffId { get; set; }
    public Staff Staff { get; set; } = null!;
}
