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
public class UserCreationRequestsController : ControllerBase
{
    private readonly IUserCreationRequestService _userCreationRequestService;
    private readonly ILogger<UserCreationRequestsController> _logger;

    public UserCreationRequestsController(
        IUserCreationRequestService userCreationRequestService,
        ILogger<UserCreationRequestsController> logger)
    {
        _userCreationRequestService = userCreationRequestService;
        _logger = logger;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<UserCreationRequestDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetAllRequests()
    {
        try
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userCorporateId = User.FindFirst("CorporateId")?.Value;

            IEnumerable<UserCreationRequestDto> requests;

            // Super Admin can see all requests
            if (userRole == UserRole.SuperAdmin.ToString())
            {
                requests = await _userCreationRequestService.GetAllRequestsAsync();
            }
            // Corporate Admin can only see their corporate's requests
            else if (userRole == UserRole.CorporateAdmin.ToString() && !string.IsNullOrEmpty(userCorporateId))
            {
                requests = await _userCreationRequestService.GetRequestsByCorporateAsync(Guid.Parse(userCorporateId));
            }
            else
            {
                return Forbid();
            }

            return Ok(requests);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching user creation requests");
            return BadRequest(new { message = "An error occurred while fetching user creation requests" });
        }
    }

    [HttpGet("pending")]
    [Authorize(Roles = "SuperAdmin")]
    [ProducesResponseType(typeof(IEnumerable<UserCreationRequestDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetPendingRequests()
    {
        try
        {
            var requests = await _userCreationRequestService.GetPendingRequestsAsync();
            return Ok(requests);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching pending user creation requests");
            return BadRequest(new { message = "An error occurred while fetching pending requests" });
        }
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(UserCreationRequestDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetRequestById(Guid id)
    {
        try
        {
            var request = await _userCreationRequestService.GetRequestByIdAsync(id);
            if (request == null)
            {
                return NotFound(new { message = "Request not found" });
            }

            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userCorporateId = User.FindFirst("CorporateId")?.Value;

            // Corporate Admin can only view their own corporate's requests
            if (userRole == UserRole.CorporateAdmin.ToString() &&
                request.CorporateId.ToString() != userCorporateId)
            {
                return Forbid();
            }

            return Ok(request);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching user creation request {RequestId}", id);
            return BadRequest(new { message = "An error occurred while fetching request" });
        }
    }

    [HttpPost]
    [Authorize(Roles = "CorporateAdmin")]
    [ProducesResponseType(typeof(UserCreationRequestDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> CreateRequest([FromBody] CreateUserCreationRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userCorporateId = User.FindFirst("CorporateId")?.Value;

            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(userCorporateId))
            {
                return BadRequest(new { message = "User information not found" });
            }

            // Ensure Corporate Admin can only create requests for their own corporate
            request.CorporateId = Guid.Parse(userCorporateId);

            var createdRequest = await _userCreationRequestService.CreateRequestAsync(Guid.Parse(userId), request);
            return CreatedAtAction(nameof(GetRequestById), new { id = createdRequest.Id }, createdRequest);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating user creation request");
            return BadRequest(new { message = "An error occurred while creating request" });
        }
    }

    [HttpPost("{id}/approve")]
    [Authorize(Roles = "SuperAdmin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ApproveRequest(Guid id, [FromBody] ApproveUserCreationRequestDto approveDto)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest(new { message = "User information not found" });
            }

            var result = await _userCreationRequestService.ApproveRequestAsync(id, Guid.Parse(userId), approveDto);
            if (!result)
            {
                return NotFound(new { message = "Request not found or already processed" });
            }

            return Ok(new { message = "User creation request approved and user created successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error approving user creation request {RequestId}", id);
            return BadRequest(new { message = "An error occurred while approving request" });
        }
    }

    [HttpPost("{id}/reject")]
    [Authorize(Roles = "SuperAdmin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RejectRequest(Guid id, [FromBody] RejectUserCreationRequestDto rejectDto)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest(new { message = "User information not found" });
            }

            var result = await _userCreationRequestService.RejectRequestAsync(id, Guid.Parse(userId), rejectDto);
            if (!result)
            {
                return NotFound(new { message = "Request not found or already processed" });
            }

            return Ok(new { message = "User creation request rejected successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error rejecting user creation request {RequestId}", id);
            return BadRequest(new { message = "An error occurred while rejecting request" });
        }
    }
}
