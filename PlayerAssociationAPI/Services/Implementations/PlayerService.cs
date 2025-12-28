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
            var players = await _context.Players.ToListAsync();
            return players.Select(p => ConvertToDto(p));
        }

        public async Task<PlayerReadDto?> GetByIdAsync(int id)
        {
            var player = await _context.Players.FindAsync(id);
            if (player == null) return null;
            return ConvertToDto(player);
        }

        public async Task<PlayerReadDto> CreateAsync(PlayerCreateDto dto)
        {
            try
            {
                Console.WriteLine($"Creating player: {dto.FullName}");
                Console.WriteLine($"Image file: {dto.ImageFile?.FileName}");

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

                if (dto.ImageFile != null && dto.ImageFile.Length > 0)
                {
                    Console.WriteLine($"Processing image file: {dto.ImageFile.FileName}, Size: {dto.ImageFile.Length}");
                    player.ImagePath = await SaveImageAsync(dto.ImageFile);
                    Console.WriteLine($"Image saved at: {player.ImagePath}");
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
            var player = await _context.Players.FindAsync(id);
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

            if (dto.ImageFile != null && dto.ImageFile.Length > 0)
            {
                // Delete old image if exists
                if (!string.IsNullOrEmpty(player.ImagePath))
                    DeleteImage(player.ImagePath);

                player.ImagePath = await SaveImageAsync(dto.ImageFile);
            }

            player.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return ConvertToDto(player);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var player = await _context.Players.FindAsync(id);
            if (player == null) return false;

            // Delete image file if exists
            if (!string.IsNullOrEmpty(player.ImagePath))
                DeleteImage(player.ImagePath);

            _context.Players.Remove(player);
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
                    Console.WriteLine($"Created directory: {uploadsFolder}");
                }

                // Generate unique filename
                var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                Console.WriteLine($"Saving file to: {filePath}");

                // Save file
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }

                // Return relative URL path
                var request = _httpContextAccessor.HttpContext?.Request;
                var baseUrl = $"{request?.Scheme}://{request?.Host}";
                return $"{baseUrl}/uploads/{uniqueFileName}";
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
                ImagePath = player.ImagePath,
                CreatedAt = player.CreatedAt,
                UpdatedAt = player.UpdatedAt
            };
        }
    }
}