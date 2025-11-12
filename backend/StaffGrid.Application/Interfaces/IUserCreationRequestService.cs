using StaffGrid.Application.DTOs;

namespace StaffGrid.Application.Interfaces;

public interface IUserCreationRequestService
{
    Task<IEnumerable<UserCreationRequestDto>> GetAllRequestsAsync();
    Task<IEnumerable<UserCreationRequestDto>> GetPendingRequestsAsync();
    Task<IEnumerable<UserCreationRequestDto>> GetRequestsByCorporateAsync(Guid corporateId);
    Task<UserCreationRequestDto?> GetRequestByIdAsync(Guid requestId);
    Task<UserCreationRequestDto> CreateRequestAsync(Guid requestedById, CreateUserCreationRequest request);
    Task<bool> ApproveRequestAsync(Guid requestId, Guid approverId, ApproveUserCreationRequestDto approveDto);
    Task<bool> RejectRequestAsync(Guid requestId, Guid approverId, RejectUserCreationRequestDto rejectDto);
}
