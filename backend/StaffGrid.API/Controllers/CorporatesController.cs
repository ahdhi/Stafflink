using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StaffGrid.Application.DTOs;
using StaffGrid.Application.Interfaces;

namespace StaffGrid.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "SuperAdmin,CorporateAdmin")]
public class CorporatesController : ControllerBase
{
    private readonly ICorporateManagementService _corporateManagementService;
    private readonly ILogger<CorporatesController> _logger;

    public CorporatesController(
        ICorporateManagementService corporateManagementService,
        ILogger<CorporatesController> logger)
    {
        _corporateManagementService = corporateManagementService;
        _logger = logger;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<CorporateDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetAllCorporates()
    {
        try
        {
            var corporates = await _corporateManagementService.GetAllCorporatesAsync();
            return Ok(corporates);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching corporates");
            return BadRequest(new { message = "An error occurred while fetching corporates" });
        }
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(CorporateDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCorporateById(Guid id)
    {
        try
        {
            var corporate = await _corporateManagementService.GetCorporateByIdAsync(id);
            if (corporate == null)
            {
                return NotFound(new { message = "Corporate not found" });
            }

            return Ok(corporate);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching corporate {CorporateId}", id);
            return BadRequest(new { message = "An error occurred while fetching corporate" });
        }
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin")]
    [ProducesResponseType(typeof(CorporateDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> CreateCorporate([FromBody] CreateCorporateRequest request)
    {
        try
        {
            var corporate = await _corporateManagementService.CreateCorporateAsync(request);
            return CreatedAtAction(nameof(GetCorporateById), new { id = corporate.Id }, corporate);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating corporate");
            return BadRequest(new { message = "An error occurred while creating corporate" });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "SuperAdmin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateCorporate(Guid id, [FromBody] UpdateCorporateRequest request)
    {
        try
        {
            var result = await _corporateManagementService.UpdateCorporateAsync(id, request);
            if (!result)
            {
                return NotFound(new { message = "Corporate not found" });
            }

            return Ok(new { message = "Corporate updated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating corporate {CorporateId}", id);
            return BadRequest(new { message = "An error occurred while updating corporate" });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "SuperAdmin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteCorporate(Guid id)
    {
        try
        {
            var result = await _corporateManagementService.DeleteCorporateAsync(id);
            if (!result)
            {
                return NotFound(new { message = "Corporate not found" });
            }

            return Ok(new { message = "Corporate deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting corporate {CorporateId}", id);
            return BadRequest(new { message = "An error occurred while deleting corporate" });
        }
    }
}
