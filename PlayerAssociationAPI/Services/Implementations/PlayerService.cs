using Microsoft.EntityFrameworkCore;
using PlayerAssociationAPI.Data;
using PlayerAssociationAPI.DTOs.Player;
using PlayerAssociationAPI.Models;
using PlayerAssociationAPI.Services.Interfaces;

namespace PlayerAssociationAPI.Services.Implementations
{
    public class PlayerService : IPlayerService
    {
        private readonly AppDbContext _context;

        public PlayerService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PlayerReadDto>> GetAllAsync()
        {
            return await _context.Players
                .Select(p => new PlayerReadDto
                {
                    Id = p.Id,
                    FullName = p.FullName,
                    Age = p.Age,
                    Club = p.Club,
                    Position = p.Position,
                    Nationality = p.Nationality,
                    Description = p.Description,
                    ImagePath = p.ImagePath
                }).ToListAsync();
        }

        public async Task<PlayerReadDto?> GetByIdAsync(int id)
        {
            var player = await _context.Players.FindAsync(id);
            if (player == null) return null;

            return new PlayerReadDto
            {
                Id = player.Id,
                FullName = player.FullName,
                Age = player.Age,
                Club = player.Club,
                Position = player.Position,
                Nationality = player.Nationality,
                Description = player.Description,
                ImagePath = player.ImagePath
            };
        }

        public async Task<PlayerReadDto> CreateAsync(PlayerCreateDto dto)
        {
            var player = new Player
            {
                FullName = dto.FullName,
                Age = dto.Age,
                Club = dto.Club,
                Position = dto.Position,
                Nationality = dto.Nationality,
                Description = dto.Description,
                ImagePath = dto.ImagePath
            };

            _context.Players.Add(player);
            await _context.SaveChangesAsync();

            return new PlayerReadDto
            {
                Id = player.Id,
                FullName = player.FullName,
                Age = player.Age,
                Club = player.Club,
                Position = player.Position,
                Nationality = player.Nationality,
                Description = player.Description,
                ImagePath = player.ImagePath
            };
        }

        public async Task<PlayerReadDto?> UpdateAsync(int id, PlayerUpdateDto dto)
        {
            var player = await _context.Players.FindAsync(id);
            if (player == null) return null;

            player.FullName = dto.FullName ?? player.FullName;
            player.Age = dto.Age ?? player.Age;
            player.Club = dto.Club ?? player.Club;
            player.Position = dto.Position ?? player.Position;
            player.Nationality = dto.Nationality ?? player.Nationality;
            player.Description = dto.Description ?? player.Description;
            player.ImagePath = dto.ImagePath ?? player.ImagePath;
            player.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new PlayerReadDto
            {
                Id = player.Id,
                FullName = player.FullName,
                Age = player.Age,
                Club = player.Club,
                Position = player.Position,
                Nationality = player.Nationality,
                Description = player.Description,
                ImagePath = player.ImagePath
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var player = await _context.Players.FindAsync(id);
            if (player == null) return false;

            _context.Players.Remove(player);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
