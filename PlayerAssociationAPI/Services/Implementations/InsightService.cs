using Microsoft.EntityFrameworkCore;
using PlayerAssociationAPI.Data;
using PlayerAssociationAPI.DTOs.Insight;
using PlayerAssociationAPI.Models;
using PlayerAssociationAPI.Services.Interfaces;

namespace PlayerAssociationAPI.Services.Implementations
{
    public class InsightService : IInsightService
    {
        private readonly AppDbContext _context;

        public InsightService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<InsightReadDto>> GetAllAsync()
        {
            return await _context.Insights
                .Select(i => new InsightReadDto
                {
                    Id = i.Id,
                    Title = i.Title,
                    Description = i.Description,
                    Content = i.Content,
                    Author = i.Author,
                    Category = i.Category,
                    ImagePath = i.ImagePath
                }).ToListAsync();
        }

        public async Task<InsightReadDto?> GetByIdAsync(int id)
        {
            var insight = await _context.Insights.FindAsync(id);
            if (insight == null) return null;

            return new InsightReadDto
            {
                Id = insight.Id,
                Title = insight.Title,
                Description = insight.Description,
                Content = insight.Content,
                Author = insight.Author,
                Category = insight.Category,
                ImagePath = insight.ImagePath
            };
        }

        public async Task<IEnumerable<InsightReadDto>> GetByCategoryAsync(InsightCategory category)
        {
            return await _context.Insights
                .Where(i => i.Category == category)
                .Select(i => new InsightReadDto
                {
                    Id = i.Id,
                    Title = i.Title,
                    Description = i.Description,
                    Content = i.Content,
                    Author = i.Author,
                    Category = i.Category,
                    ImagePath = i.ImagePath
                }).ToListAsync();
        }

        public async Task<InsightReadDto> CreateAsync(InsightCreateDto dto)
        {
            var insight = new Insight
            {
                Title = dto.Title,
                Description = dto.Description,
                Content = dto.Content,
                Author = dto.Author,
                Category = dto.Category,
                ImagePath = dto.ImagePath
            };

            _context.Insights.Add(insight);
            await _context.SaveChangesAsync();

            return new InsightReadDto
            {
                Id = insight.Id,
                Title = insight.Title,
                Description = insight.Description,
                Content = insight.Content,
                Author = insight.Author,
                Category = insight.Category,
                ImagePath = insight.ImagePath
            };
        }

        public async Task<InsightReadDto?> UpdateAsync(int id, InsightUpdateDto dto)
        {
            var insight = await _context.Insights.FindAsync(id);
            if (insight == null) return null;

            insight.Title = dto.Title ?? insight.Title;
            insight.Description = dto.Description ?? insight.Description;
            insight.Content = dto.Content ?? insight.Content;
            insight.Author = dto.Author ?? insight.Author;
            insight.Category = dto.Category ?? insight.Category;
            insight.ImagePath = dto.ImagePath ?? insight.ImagePath;
            insight.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new InsightReadDto
            {
                Id = insight.Id,
                Title = insight.Title,
                Description = insight.Description,
                Content = insight.Content,
                Author = insight.Author,
                Category = insight.Category,
                ImagePath = insight.ImagePath
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var insight = await _context.Insights.FindAsync(id);
            if (insight == null) return false;

            _context.Insights.Remove(insight);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
