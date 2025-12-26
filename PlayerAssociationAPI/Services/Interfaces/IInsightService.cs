using PlayerAssociationAPI.DTOs.Insight;
using PlayerAssociationAPI.Models;

namespace PlayerAssociationAPI.Services.Interfaces
{
    public interface IInsightService
    {
        Task<IEnumerable<InsightReadDto>> GetAllAsync();
        Task<InsightReadDto?> GetByIdAsync(int id);
        Task<IEnumerable<InsightReadDto>> GetByCategoryAsync(InsightCategory category);
        Task<InsightReadDto> CreateAsync(InsightCreateDto dto);
        Task<InsightReadDto?> UpdateAsync(int id, InsightUpdateDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
