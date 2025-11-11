using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StaffGrid.Application.DTOs;
using StaffGrid.Application.Interfaces;
using StaffGrid.Core.Enums;
using System.Security.Claims;

namespace StaffGrid.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ShiftsController : ControllerBase
{
    private readonly IShiftService _shiftService;
    private readonly ILogger<ShiftsController> _logger;

    public ShiftsController(IShiftService shiftService, ILogger<ShiftsController> logger)
    {
        _shiftService = shiftService;
        _logger = logger;
    }

    [HttpGet]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] ShiftStatus? status = null,
        [FromQuery] Guid? facilityId = null,
        [FromQuery] Guid? departmentId = null,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        try
        {
            var (shifts, totalCount) = await _shiftService.GetAllAsync(
                page, pageSize, status, facilityId, departmentId, startDate, endDate);

            return Ok(new
            {
                data = shifts,
                totalCount,
                page,
                pageSize,
                totalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting shifts");
            return BadRequest(new { message = "An error occurred while fetching shifts" });
        }
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ShiftDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        try
        {
            var shift = await _shiftService.GetByIdAsync(id);
            return Ok(shift);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Shift not found" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting shift {ShiftId}", id);
            return BadRequest(new { message = "An error occurred while fetching the shift" });
        }
    }

    [HttpGet("my-shifts")]
    [ProducesResponseType(typeof(List<ShiftListDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMyShifts([FromQuery] ShiftStatus? status = null)
    {
        try
        {
            var userId = GetUserId();
            var shifts = await _shiftService.GetMyShiftsAsync(userId, status);
            return Ok(shifts);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user shifts");
            return BadRequest(new { message = "An error occurred while fetching your shifts" });
        }
    }

    [HttpPost]
    [ProducesResponseType(typeof(ShiftDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateShiftRequest request)
    {
        try
        {
            var userId = GetUserId();
            var shift = await _shiftService.CreateAsync(request, userId);
            return CreatedAtAction(nameof(GetById), new { id = shift.Id }, shift);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating shift");
            return BadRequest(new { message = "An error occurred while creating the shift" });
        }
    }

    [HttpPut("{id}")]
    [ProducesResponseType(typeof(ShiftDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateShiftRequest request)
    {
        try
        {
            var userId = GetUserId();
            var shift = await _shiftService.UpdateAsync(id, request, userId);
            return Ok(shift);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Shift not found" });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating shift {ShiftId}", id);
            return BadRequest(new { message = "An error occurred while updating the shift" });
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
            var result = await _shiftService.DeleteAsync(id, userId);
            if (!result)
            {
                return NotFound(new { message = "Shift not found" });
            }
            return NoContent();
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting shift {ShiftId}", id);
            return BadRequest(new { message = "An error occurred while deleting the shift" });
        }
    }

    [HttpPost("{id}/broadcast")]
    [ProducesResponseType(typeof(ShiftDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Broadcast(Guid id, [FromBody] BroadcastShiftRequest request)
    {
        try
        {
            var userId = GetUserId();
            var shift = await _shiftService.BroadcastAsync(id, request, userId);
            return Ok(shift);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Shift not found" });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error broadcasting shift {ShiftId}", id);
            return BadRequest(new { message = "An error occurred while broadcasting the shift" });
        }
    }

    [HttpPost("{id}/assign")]
    [ProducesResponseType(typeof(ShiftDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AssignStaff(Guid id, [FromBody] AssignStaffRequest request)
    {
        try
        {
            var userId = GetUserId();
            var shift = await _shiftService.AssignStaffAsync(id, request.StaffId, userId);
            return Ok(shift);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Shift not found" });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error assigning staff to shift {ShiftId}", id);
            return BadRequest(new { message = "An error occurred while assigning staff" });
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

    public class AssignStaffRequest
    {
        public Guid StaffId { get; set; }
    }
}
