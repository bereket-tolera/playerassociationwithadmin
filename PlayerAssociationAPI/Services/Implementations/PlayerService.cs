using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using PlayerAssociationAPI.Data;
using PlayerAssociationAPI.DTOs.Player;
using PlayerAssociationAPI.Models;
using PlayerAssociationAPI.Services.Interfaces;
using System;

namespace PlayerAssociationAPI.Services.Implementations
{
    public class PlayerService : IPlayerService
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public PlayerService(AppDbContext context, IWebHostEnvironment env, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _env = env;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<IEnumerable<PlayerReadDto>> GetAllAsync()
        {
            var players = await _context.Players.Include(p => p.Images).ToListAsync();
            return players.Select(p => ConvertToDto(p));
        }

        public async Task<PlayerReadDto?> GetByIdAsync(int id)
        {
            var player = await _context.Players.Include(p => p.Images).FirstOrDefaultAsync(p => p.Id == id);
            if (player == null) return null;
            return ConvertToDto(player);
        }

        public async Task<PlayerReadDto> CreateAsync(PlayerCreateDto dto)
        {
            try
            {
                Console.WriteLine($"Creating player: {dto.FullName}");
                Console.WriteLine($"Image files count: {dto.ImageFiles?.Count ?? 0}");

                var player = new Player
                {
                    FullName = dto.FullName?.Trim() ?? throw new ArgumentException("FullName is required"),
                    Age = dto.Age,
                    Club = dto.Club?.Trim() ?? "",
                    Position = dto.Position?.Trim() ?? "",
                    Nationality = dto.Nationality?.Trim() ?? "",
                    Description = dto.Description?.Trim() ?? "",
                    CreatedAt = DateTime.UtcNow
                };

                if (dto.ImageFiles != null && dto.ImageFiles.Any())
                {
                    foreach (var file in dto.ImageFiles)
                    {
                        if (file.Length > 0)
                        {
                            var imagePath = await SaveImageAsync(file);
                            player.Images.Add(new PlayerImage { ImagePath = imagePath });
                        }
                    }
                }

                _context.Players.Add(player);
                await _context.SaveChangesAsync();

                return ConvertToDto(player);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in CreateAsync: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                throw;
            }
        }

        public async Task<PlayerReadDto?> UpdateAsync(int id, PlayerUpdateDto dto)
        {
            var player = await _context.Players.Include(p => p.Images).FirstOrDefaultAsync(p => p.Id == id);
            if (player == null) return null;

            if (!string.IsNullOrWhiteSpace(dto.FullName))
                player.FullName = dto.FullName.Trim();
            
            player.Age = dto.Age ?? player.Age;
            
            if (!string.IsNullOrWhiteSpace(dto.Club))
                player.Club = dto.Club.Trim();
            
            if (!string.IsNullOrWhiteSpace(dto.Position))
                player.Position = dto.Position.Trim();
            
            if (!string.IsNullOrWhiteSpace(dto.Nationality))
                player.Nationality = dto.Nationality.Trim();
            
            if (!string.IsNullOrWhiteSpace(dto.Description))
                player.Description = dto.Description.Trim();

            if (dto.ImageFiles != null && dto.ImageFiles.Any())
            {
                // Replace old images with the new one (as requested: single profile image)
                foreach (var oldImg in player.Images) 
                {
                    DeleteImage(oldImg.ImagePath);
                }
                player.Images.Clear();
                
                foreach (var file in dto.ImageFiles)
                {
                    if (file.Length > 0)
                    {
                        var imagePath = await SaveImageAsync(file);
                        player.Images.Add(new PlayerImage { ImagePath = imagePath });
                    }
                }
            }

            player.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return ConvertToDto(player);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var player = await _context.Players.Include(p => p.Images).FirstOrDefaultAsync(p => p.Id == id);
            if (player == null) return false;

            // Delete associated images
            foreach (var img in player.Images)
            {
                DeleteImage(img.ImagePath);
            }

            _context.Players.Remove(player);
            await _context.SaveChangesAsync();

            return true;
        }

        private async Task<string> SaveImageAsync(IFormFile file)
        {
            try
            {
                // Ensure wwwroot/uploads directory exists
                // Use a more robust way to get the uploads path
                var webRoot = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                var uploadsFolder = Path.Combine(webRoot, "uploads");
                
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

                // Return relative path for better portability
                // imageUtils.ts on frontend will prepend the base URL
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
                    Console.WriteLine($"Deleted image: {filePath}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting image: {ex.Message}");
                // Don't throw - image deletion failure shouldn't prevent other operations
            }
        }

        private PlayerReadDto ConvertToDto(Player player)
        {
            return new PlayerReadDto
            {
                Id = player.Id,
                FullName = player.FullName,
                Age = player.Age,
                Club = player.Club,
                Position = player.Position,
                Nationality = player.Nationality,
                Description = player.Description,
                ImagePath = player.Images.FirstOrDefault()?.ImagePath,
                CreatedAt = player.CreatedAt,
                UpdatedAt = player.UpdatedAt
            };
        }
    }
}