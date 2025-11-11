using StaffGrid.Core.Enums;

namespace StaffGrid.Core.Entities;

public class FacilityAgency : BaseEntity
{
    public Guid FacilityId { get; set; }
    public Facility Facility { get; set; } = null!;

    public Guid AgencyId { get; set; }
    public Agency Agency { get; set; } = null!;

    public AgencyTier Tier { get; set; } = AgencyTier.Tier3;
    public bool IsActive { get; set; } = true;
    public DateTime? PartnershipStartDate { get; set; }
    public DateTime? PartnershipEndDate { get; set; }
}
