using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using PlayerAssociationAPI.Data;
using PlayerAssociationAPI.DTOs.Event;
using PlayerAssociationAPI.Models;
using PlayerAssociationAPI.Services.Interfaces;

namespace PlayerAssociationAPI.Services.Implementations
{
    public class EventService : IEventService
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public EventService(AppDbContext context, IWebHostEnvironment env, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _env = env;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<IEnumerable<EventReadDto>> GetAllAsync()
        {
            return await _context.Events
                .Select(e => new EventReadDto
                {
                    Id = e.Id,
                    Title = e.Title,
                    Description = e.Description,
                    ImagePath = e.ImagePath,
                    EventDate = e.EventDate,
                    Location = e.Location
                }).ToListAsync();
        }

        public async Task<EventReadDto?> GetByIdAsync(int id)
        {
            var ev = await _context.Events.FindAsync(id);
            if (ev == null) return null;

            return new EventReadDto
            {
                Id = ev.Id,
                Title = ev.Title,
                Description = ev.Description,
                ImagePath = ev.ImagePath,
                EventDate = ev.EventDate,
                Location = ev.Location
            };
        }

        public async Task<EventReadDto> CreateAsync(EventCreateDto dto)
        {
            var ev = new Event
            {
                Title = dto.Title,
                Description = dto.Description,
                EventDate = dto.EventDate,
                Location = dto.Location,
                CreatedAt = DateTime.UtcNow
            };

            if (dto.ImageFile != null && dto.ImageFile.Length > 0)
            {
                ev.ImagePath = await SaveImageAsync(dto.ImageFile);
            }

            _context.Events.Add(ev);
            await _context.SaveChangesAsync();

            return ConvertToDto(ev);
        }

        public async Task<EventReadDto?> UpdateAsync(int id, EventUpdateDto dto)
        {
            var ev = await _context.Events.FindAsync(id);
            if (ev == null) return null;

            ev.Title = dto.Title ?? ev.Title;
            ev.Description = dto.Description ?? ev.Description;
            ev.EventDate = dto.EventDate ?? ev.EventDate;
            ev.Location = dto.Location ?? ev.Location;
            ev.UpdatedAt = DateTime.UtcNow;

            if (dto.ImageFile != null && dto.ImageFile.Length > 0)
            {
                // Delete old image if exists
                if (!string.IsNullOrEmpty(ev.ImagePath))
                    DeleteImage(ev.ImagePath);

                ev.ImagePath = await SaveImageAsync(dto.ImageFile);
            }

            await _context.SaveChangesAsync();

            return ConvertToDto(ev);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var ev = await _context.Events.FindAsync(id);
            if (ev == null) return false;

            // Delete image file if exists
            if (!string.IsNullOrEmpty(ev.ImagePath))
                DeleteImage(ev.ImagePath);

            _context.Events.Remove(ev);
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

        private EventReadDto ConvertToDto(Event ev)
        {
            var request = _httpContextAccessor.HttpContext?.Request;
            var baseUrl = $"{request?.Scheme}://{request?.Host}";

            return new EventReadDto
            {
                Id = ev.Id,
                Title = ev.Title,
                Description = ev.Description,
                ImagePath = !string.IsNullOrEmpty(ev.ImagePath) 
                    ? $"{baseUrl}{ev.ImagePath}" 
                    : ev.ImagePath,
                EventDate = ev.EventDate,
                Location = ev.Location
            };
        }
    }
}