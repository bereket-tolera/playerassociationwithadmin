using PlayerAssociationAPI.DTOs.Event;

namespace PlayerAssociationAPI.Services.Interfaces
{
    public interface IEventService
    {
        Task<IEnumerable<EventReadDto>> GetAllAsync();
        Task<EventReadDto?> GetByIdAsync(int id);
        Task<EventReadDto> CreateAsync(EventCreateDto dto);
        Task<EventReadDto?> UpdateAsync(int id, EventUpdateDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
