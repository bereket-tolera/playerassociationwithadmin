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
            var events = await _context.Events.Include(e => e.Images).ToListAsync();
            return events.Select(e => ConvertToDto(e));
        }

        public async Task<EventReadDto?> GetByIdAsync(int id)
        {
            var ev = await _context.Events.Include(e => e.Images).FirstOrDefaultAsync(e => e.Id == id);
            if (ev == null) return null;

            return ConvertToDto(ev);
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

            if (dto.ImageFiles != null && dto.ImageFiles.Any())
            {
                foreach (var file in dto.ImageFiles)
                {
                    if (file.Length > 0)
                    {
                        var imagePath = await SaveImageAsync(file);
                        ev.Images.Add(new EventImage { ImagePath = imagePath });
                    }
                }
            }

            _context.Events.Add(ev);
            await _context.SaveChangesAsync();

            return ConvertToDto(ev);
        }

        public async Task<EventReadDto?> UpdateAsync(int id, EventUpdateDto dto)
        {
            var ev = await _context.Events.Include(e => e.Images).FirstOrDefaultAsync(e => e.Id == id);
            if (ev == null) return null;

            ev.Title = dto.Title ?? ev.Title;
            ev.Description = dto.Description ?? ev.Description;
            ev.EventDate = dto.EventDate ?? ev.EventDate;
            ev.Location = dto.Location ?? ev.Location;
            ev.UpdatedAt = DateTime.UtcNow;

            if (dto.ImageFiles != null && dto.ImageFiles.Any())
            {
                // Clear existing images
                foreach (var img in ev.Images.ToList())
                {
                    DeleteImage(img.ImagePath);
                    _context.EventImages.Remove(img);
                }
                ev.Images.Clear(); // Explicitly clear the collection for the current session

                foreach (var file in dto.ImageFiles)
                {
                    if (file.Length > 0)
                    {
                        var imagePath = await SaveImageAsync(file);
                        ev.Images.Add(new EventImage { ImagePath = imagePath });
                    }
                }
            }

            await _context.SaveChangesAsync();

            return ConvertToDto(ev);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var ev = await _context.Events.Include(e => e.Images).FirstOrDefaultAsync(e => e.Id == id);
            if (ev == null) return false;

            // Delete image file if exists
            // Delete associated images
            foreach (var img in ev.Images)
            {
                DeleteImage(img.ImagePath);
            }

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
                ImagePaths = ev.Images.Select(i => 
                    !string.IsNullOrEmpty(i.ImagePath) ? $"{baseUrl}{i.ImagePath}" : i.ImagePath).ToList(),
                EventDate = ev.EventDate,
                Location = ev.Location
            };
        }
    }
}