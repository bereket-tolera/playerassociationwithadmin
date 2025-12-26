using Microsoft.AspNetCore.Mvc;
using PlayerAssociationAPI.DTOs.Player;
using PlayerAssociationAPI.Services.Interfaces;

namespace PlayerAssociationAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlayersController : ControllerBase
    {
        private readonly IPlayerService _playerService;

        public PlayersController(IPlayerService playerService)
        {
            _playerService = playerService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var players = await _playerService.GetAllAsync();
            return Ok(players);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var player = await _playerService.GetByIdAsync(id);
            if (player == null) return NotFound();
            return Ok(player);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PlayerCreateDto dto)
        {
            var player = await _playerService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = player.Id }, player);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] PlayerUpdateDto dto)
        {
            var player = await _playerService.UpdateAsync(id, dto);
            if (player == null) return NotFound();
            return Ok(player);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _playerService.DeleteAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}

