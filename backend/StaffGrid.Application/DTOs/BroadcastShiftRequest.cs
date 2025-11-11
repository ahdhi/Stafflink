using System.ComponentModel.DataAnnotations;
using StaffGrid.Core.Enums;

namespace StaffGrid.Application.DTOs;

public class BroadcastShiftRequest
{
    public List<Guid>? SpecificAgencyIds { get; set; }
    public AgencyTier? StartFromTier { get; set; } = AgencyTier.Tier1;
}
