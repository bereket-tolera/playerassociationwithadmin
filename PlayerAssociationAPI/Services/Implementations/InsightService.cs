using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using PlayerAssociationAPI.Data;
using PlayerAssociationAPI.DTOs.Insight;
using PlayerAssociationAPI.Models;
using PlayerAssociationAPI.Services.Interfaces;
using System;

namespace PlayerAssociationAPI.Services.Implementations
{
    public class InsightService : IInsightService
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public InsightService(
            AppDbContext context, 
            IWebHostEnvironment env, 
            IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _env = env;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<IEnumerable<InsightReadDto>> GetAllAsync()
        {
            var insights = await _context.Insights.Include(i => i.Images).ToListAsync();
            return insights.Select(i => ConvertToDto(i));
        }

        public async Task<InsightReadDto?> GetByIdAsync(int id)
        {
            var insight = await _context.Insights.Include(i => i.Images).FirstOrDefaultAsync(i => i.Id == id);
            if (insight == null) return null;
            return ConvertToDto(insight);
        }

        public async Task<IEnumerable<InsightReadDto>> GetByCategoryAsync(InsightCategory category)
        {
            var insights = await _context.Insights
                .Include(i => i.Images)
                .Where(i => i.Category == category)
                .ToListAsync();
            return insights.Select(i => ConvertToDto(i));
        }

        public async Task<InsightReadDto> CreateAsync(InsightCreateDto dto)
        {
            try
            {
                Console.WriteLine($"Creating insight: {dto.Title}");
                Console.WriteLine($"Category from request: {dto.Category}");

                // Parse string to enum
                if (!Enum.TryParse<InsightCategory>(dto.Category, true, out var categoryEnum))
                {
                    throw new ArgumentException($"Invalid category: {dto.Category}");
                }

                var insight = new Insight
                {
                    Title = dto.Title?.Trim() ?? throw new ArgumentException("Title is required"),
                    Description = dto.Description?.Trim() ?? "",
                    Content = dto.Content?.Trim() ?? "",
                    Author = dto.Author?.Trim() ?? "",
                    Category = categoryEnum, // Use parsed enum
                    CreatedAt = DateTime.UtcNow
                };

                if (dto.ImageFiles != null && dto.ImageFiles.Any())
                {
                    foreach (var file in dto.ImageFiles)
                    {
                        if (file.Length > 0)
                        {
                            var imagePath = await SaveImageAsync(file);
                            insight.Images.Add(new InsightImage { ImagePath = imagePath });
                        }
                    }
                }

                _context.Insights.Add(insight);
                await _context.SaveChangesAsync();

                return ConvertToDto(insight);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in InsightService.CreateAsync: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                throw;
            }
        }

        public async Task<InsightReadDto?> UpdateAsync(int id, InsightUpdateDto dto)
        {
            var insight = await _context.Insights.Include(i => i.Images).FirstOrDefaultAsync(i => i.Id == id);
            if (insight == null) return null;

            if (!string.IsNullOrWhiteSpace(dto.Title))
                insight.Title = dto.Title.Trim();
            
            if (!string.IsNullOrWhiteSpace(dto.Description))
                insight.Description = dto.Description.Trim();
            
            if (!string.IsNullOrWhiteSpace(dto.Content))
                insight.Content = dto.Content.Trim();
            
            if (!string.IsNullOrWhiteSpace(dto.Author))
                insight.Author = dto.Author.Trim();
            
            // Handle category update - convert string to enum if provided
            if (!string.IsNullOrWhiteSpace(dto.Category))
            {
                if (Enum.TryParse<InsightCategory>(dto.Category, true, out var categoryEnum))
                {
                    insight.Category = categoryEnum;
                }
            }

            if (dto.ImageFiles != null && dto.ImageFiles.Any())
            {
                // Clear existing images
                foreach (var img in insight.Images.ToList())
                {
                    DeleteImage(img.ImagePath);
                    _context.InsightImages.Remove(img);
                }
                insight.Images.Clear(); // Explicitly clear the collection for the current session

                foreach (var file in dto.ImageFiles)
                {
                    if (file.Length > 0)
                    {
                        var imagePath = await SaveImageAsync(file);
                        insight.Images.Add(new InsightImage { ImagePath = imagePath });
                    }
                }
            }

            insight.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return ConvertToDto(insight);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var insight = await _context.Insights.Include(i => i.Images).FirstOrDefaultAsync(i => i.Id == id);
            if (insight == null) return false;

            // Delete image file if exists
            foreach (var img in insight.Images)
            {
                DeleteImage(img.ImagePath);
            }

            _context.Insights.Remove(insight);
            await _context.SaveChangesAsync();
            return true;
        }

        private async Task<string> SaveImageAsync(IFormFile file)
        {
            try
            {
                // Ensure wwwroot/uploads directory exists
                var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // Generate unique filename
                var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                // Save file
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }

                // Return relative path
                return $"/uploads/{uniqueFileName}";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving image: {ex.Message}");
                throw;
            }
        }

        private void DeleteImage(string imagePath)
        {
            try
            {
                if (string.IsNullOrEmpty(imagePath)) return;

                // Extract filename from URL
                var fileName = Path.GetFileName(imagePath);
                if (string.IsNullOrEmpty(fileName)) return;

                var filePath = Path.Combine(_env.WebRootPath, "uploads", fileName);
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting image: {ex.Message}");
                // Don't throw - image deletion failure shouldn't prevent other operations
            }
        }

        private InsightReadDto ConvertToDto(Insight insight)
        {
            var request = _httpContextAccessor.HttpContext?.Request;
            var baseUrl = $"{request?.Scheme}://{request?.Host}";

            // Convert enum to string for frontend
            var categoryString = insight.Category.ToString();

            return new InsightReadDto
            {
                Id = insight.Id,
                Title = insight.Title,
                Description = insight.Description,
                Content = insight.Content,
                Author = insight.Author,
                Category = categoryString, // Send as string
                ImagePaths = insight.Images.Select(i => 
                    !string.IsNullOrEmpty(i.ImagePath) ? $"{baseUrl}{i.ImagePath}" : i.ImagePath).ToList()
            };
        }
    }
}