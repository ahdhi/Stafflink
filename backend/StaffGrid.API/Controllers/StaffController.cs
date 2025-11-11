using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StaffGrid.Application.DTOs;
using StaffGrid.Application.Interfaces;
using System.Security.Claims;

namespace StaffGrid.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StaffController : ControllerBase
{
    private readonly IStaffService _staffService;
    private readonly ILogger<StaffController> _logger;

    public StaffController(IStaffService staffService, ILogger<StaffController> logger)
    {
        _staffService = staffService;
        _logger = logger;
    }

    [HttpGet]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] Guid? agencyId = null,
        [FromQuery] string? professionalType = null,
        [FromQuery] bool? isAvailable = null)
    {
        try
        {
            var (staff, totalCount) = await _staffService.GetAllAsync(page, pageSize, agencyId, professionalType, isAvailable);
            return Ok(new
            {
                data = staff,
                totalCount,
                page,
                pageSize,
                totalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting staff");
            return BadRequest(new { message = "An error occurred while fetching staff" });
        }
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(StaffDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        try
        {
            var staff = await _staffService.GetByIdAsync(id);
            return Ok(staff);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Staff not found" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting staff {StaffId}", id);
            return BadRequest(new { message = "An error occurred while fetching the staff" });
        }
    }

    [HttpGet("my-staff")]
    [ProducesResponseType(typeof(List<StaffDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMyStaff()
    {
        try
        {
            var userId = GetUserId();
            var staff = await _staffService.GetMyStaffAsync(userId);
            return Ok(staff);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user staff");
            return BadRequest(new { message = "An error occurred while fetching your staff" });
        }
    }

    [HttpPost]
    [ProducesResponseType(typeof(StaffDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateStaffRequest request)
    {
        try
        {
            var userId = GetUserId();
            var staff = await _staffService.CreateAsync(request, userId);
            return CreatedAtAction(nameof(GetById), new { id = staff.Id }, staff);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating staff");
            return BadRequest(new { message = "An error occurred while creating the staff" });
        }
    }

    [HttpPut("{id}")]
    [ProducesResponseType(typeof(StaffDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, [FromBody] CreateStaffRequest request)
    {
        try
        {
            var userId = GetUserId();
            var staff = await _staffService.UpdateAsync(id, request, userId);
            return Ok(staff);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Staff not found" });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating staff {StaffId}", id);
            return BadRequest(new { message = "An error occurred while updating the staff" });
        }
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            var userId = GetUserId();
            var result = await _staffService.DeleteAsync(id, userId);
            if (!result)
            {
                return NotFound(new { message = "Staff not found" });
            }
            return NoContent();
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting staff {StaffId}", id);
            return BadRequest(new { message = "An error occurred while deleting the staff" });
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
