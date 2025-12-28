using Microsoft.AspNetCore.Mvc;
using PlayerAssociationAPI.DTOs.Event;
using PlayerAssociationAPI.Services.Interfaces;

namespace PlayerAssociationAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly IEventService _eventService;

        public EventsController(IEventService eventService)
        {
            _eventService = eventService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var events = await _eventService.GetAllAsync();
            return Ok(events);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var ev = await _eventService.GetByIdAsync(id);
            if (ev == null) return NotFound();
            return Ok(ev);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] EventCreateDto dto) // Changed from [FromBody] to [FromForm]
        {
            var ev = await _eventService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = ev.Id }, ev);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] EventUpdateDto dto) // Changed from [FromBody] to [FromForm]
        {
            var ev = await _eventService.UpdateAsync(id, dto);
            if (ev == null) return NotFound();
            return Ok(ev);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _eventService.DeleteAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}