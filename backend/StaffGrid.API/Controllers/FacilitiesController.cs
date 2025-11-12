using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StaffGrid.Application.DTOs;
using StaffGrid.Application.Interfaces;
using StaffGrid.Core.Enums;
using System.Security.Claims;

namespace StaffGrid.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "SuperAdmin,CorporateAdmin")]
public class FacilitiesController : ControllerBase
{
    private readonly IFacilityManagementService _facilityManagementService;
    private readonly ILogger<FacilitiesController> _logger;

    public FacilitiesController(
        IFacilityManagementService facilityManagementService,
        ILogger<FacilitiesController> logger)
    {
        _facilityManagementService = facilityManagementService;
        _logger = logger;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<FacilityDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetAllFacilities()
    {
        try
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userCorporateId = User.FindFirst("CorporateId")?.Value;

            IEnumerable<FacilityDto> facilities;

            // Corporate Admin can only see their own facilities
            if (userRole == UserRole.CorporateAdmin.ToString() && !string.IsNullOrEmpty(userCorporateId))
            {
                facilities = await _facilityManagementService.GetFacilitiesByCorporateAsync(Guid.Parse(userCorporateId));
            }
            // Super Admin can see all facilities
            else
            {
                facilities = await _facilityManagementService.GetAllFacilitiesAsync();
            }

            return Ok(facilities);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching facilities");
            return BadRequest(new { message = "An error occurred while fetching facilities" });
        }
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(FacilityDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetFacilityById(Guid id)
    {
        try
        {
            var facility = await _facilityManagementService.GetFacilityByIdAsync(id);
            if (facility == null)
            {
                return NotFound(new { message = "Facility not found" });
            }

            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userCorporateId = User.FindFirst("CorporateId")?.Value;

            // Corporate Admin can only view their own facilities
            if (userRole == UserRole.CorporateAdmin.ToString() &&
                facility.CorporateId.ToString() != userCorporateId)
            {
                return Forbid();
            }

            return Ok(facility);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching facility {FacilityId}", id);
            return BadRequest(new { message = "An error occurred while fetching facility" });
        }
    }

    [HttpPost]
    [ProducesResponseType(typeof(FacilityDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> CreateFacility([FromBody] CreateFacilityRequest request)
    {
        try
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userCorporateId = User.FindFirst("CorporateId")?.Value;

            // Corporate Admin can only create facilities for their own corporate
            if (userRole == UserRole.CorporateAdmin.ToString())
            {
                if (string.IsNullOrEmpty(userCorporateId))
                {
                    return BadRequest(new { message = "Corporate Admin must be associated with a corporate" });
                }

                request.CorporateId = Guid.Parse(userCorporateId);
            }

            var facility = await _facilityManagementService.CreateFacilityAsync(request);
            return CreatedAtAction(nameof(GetFacilityById), new { id = facility.Id }, facility);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating facility");
            return BadRequest(new { message = "An error occurred while creating facility" });
        }
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateFacility(Guid id, [FromBody] UpdateFacilityRequest request)
    {
        try
        {
            var facility = await _facilityManagementService.GetFacilityByIdAsync(id);
            if (facility == null)
            {
                return NotFound(new { message = "Facility not found" });
            }

            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userCorporateId = User.FindFirst("CorporateId")?.Value;

            // Corporate Admin can only update their own facilities
            if (userRole == UserRole.CorporateAdmin.ToString())
            {
                if (facility.CorporateId.ToString() != userCorporateId)
                {
                    return Forbid();
                }

                // Corporate Admin cannot change the corporate ID
                request.CorporateId = null;
            }

            var result = await _facilityManagementService.UpdateFacilityAsync(id, request);
            if (!result)
            {
                return NotFound(new { message = "Facility not found" });
            }

            return Ok(new { message = "Facility updated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating facility {FacilityId}", id);
            return BadRequest(new { message = "An error occurred while updating facility" });
        }
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteFacility(Guid id)
    {
        try
        {
            var facility = await _facilityManagementService.GetFacilityByIdAsync(id);
            if (facility == null)
            {
                return NotFound(new { message = "Facility not found" });
            }

            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userCorporateId = User.FindFirst("CorporateId")?.Value;

            // Corporate Admin can only delete their own facilities
            if (userRole == UserRole.CorporateAdmin.ToString())
            {
                if (facility.CorporateId.ToString() != userCorporateId)
                {
                    return Forbid();
                }
            }

            var result = await _facilityManagementService.DeleteFacilityAsync(id);
            if (!result)
            {
                return NotFound(new { message = "Facility not found" });
            }

            return Ok(new { message = "Facility deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting facility {FacilityId}", id);
            return BadRequest(new { message = "An error occurred while deleting facility" });
        }
    }
}
