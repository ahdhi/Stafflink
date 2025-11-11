using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StaffGrid.Application.DTOs;
using StaffGrid.Application.Interfaces;
using System.Security.Claims;

namespace StaffGrid.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AgenciesController : ControllerBase
{
    private readonly IAgencyService _agencyService;
    private readonly ILogger<AgenciesController> _logger;

    public AgenciesController(IAgencyService agencyService, ILogger<AgenciesController> logger)
    {
        _agencyService = agencyService;
        _logger = logger;
    }

    [HttpGet]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        try
        {
            var (agencies, totalCount) = await _agencyService.GetAllAsync(page, pageSize);
            return Ok(new
            {
                data = agencies,
                totalCount,
                page,
                pageSize,
                totalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting agencies");
            return BadRequest(new { message = "An error occurred while fetching agencies" });
        }
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(AgencyDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        try
        {
            var agency = await _agencyService.GetByIdAsync(id);
            return Ok(agency);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Agency not found" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting agency {AgencyId}", id);
            return BadRequest(new { message = "An error occurred while fetching the agency" });
        }
    }

    [HttpGet("my-agencies")]
    [ProducesResponseType(typeof(List<AgencyDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMyAgencies()
    {
        try
        {
            var userId = GetUserId();
            var agencies = await _agencyService.GetMyAgenciesAsync(userId);
            return Ok(agencies);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user agencies");
            return BadRequest(new { message = "An error occurred while fetching your agencies" });
        }
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            throw new UnauthorizedAccessException("Invalid user token");
        }
        return userId;
    }
}
