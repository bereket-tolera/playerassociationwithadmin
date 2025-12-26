using Microsoft.EntityFrameworkCore;
using PlayerAssociationAPI.Data;
using PlayerAssociationAPI.DTOs.Event;
using PlayerAssociationAPI.Models;
using PlayerAssociationAPI.Services.Interfaces;

namespace PlayerAssociationAPI.Services.Implementations
{
    public class EventService : IEventService
    {
        private readonly AppDbContext _context;

        public EventService(AppDbContext context)
        {
            _context = context;
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
                ImagePath = dto.ImagePath,
                EventDate = dto.EventDate,
                Location = dto.Location
            };

            _context.Events.Add(ev);
            await _context.SaveChangesAsync();

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

        public async Task<EventReadDto?> UpdateAsync(int id, EventUpdateDto dto)
        {
            var ev = await _context.Events.FindAsync(id);
            if (ev == null) return null;

            ev.Title = dto.Title ?? ev.Title;
            ev.Description = dto.Description ?? ev.Description;
            ev.ImagePath = dto.ImagePath ?? ev.ImagePath;
            ev.EventDate = dto.EventDate ?? ev.EventDate;
            ev.Location = dto.Location ?? ev.Location;
            ev.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

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

        public async Task<bool> DeleteAsync(int id)
        {
            var ev = await _context.Events.FindAsync(id);
            if (ev == null) return false;

            _context.Events.Remove(ev);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
