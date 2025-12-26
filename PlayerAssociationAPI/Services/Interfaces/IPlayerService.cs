using PlayerAssociationAPI.DTOs.Player;

namespace PlayerAssociationAPI.Services.Interfaces
{
    public interface IPlayerService
    {
        Task<IEnumerable<PlayerReadDto>> GetAllAsync();
        Task<PlayerReadDto?> GetByIdAsync(int id);
        Task<PlayerReadDto> CreateAsync(PlayerCreateDto dto);
        Task<PlayerReadDto?> UpdateAsync(int id, PlayerUpdateDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
