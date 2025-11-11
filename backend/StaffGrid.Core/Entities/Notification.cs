namespace StaffGrid.Core.Entities;

public class Notification : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public required string Title { get; set; }
    public required string Message { get; set; }
    public string? Type { get; set; } // ShiftBroadcast, ShiftAssigned, ShiftCancelled, etc.
    public bool IsRead { get; set; } = false;
    public string? ActionUrl { get; set; }
    public string? MetadataJson { get; set; } // Store metadata as JSON string
    public DateTime? ReadAt { get; set; }
}
