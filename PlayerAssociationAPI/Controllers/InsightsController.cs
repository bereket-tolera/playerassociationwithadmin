using Microsoft.AspNetCore.Mvc;
using PlayerAssociationAPI.DTOs.Insight;
using PlayerAssociationAPI.Models;
using PlayerAssociationAPI.Services.Interfaces;

namespace PlayerAssociationAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InsightsController : ControllerBase
    {
        private readonly IInsightService _insightService;

        public InsightsController(IInsightService insightService)
        {
            _insightService = insightService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var insights = await _insightService.GetAllAsync();
            return Ok(insights);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var insight = await _insightService.GetByIdAsync(id);
            if (insight == null) return NotFound();
            return Ok(insight);
        }

        [HttpGet("category/{category}")]
        public async Task<IActionResult> GetByCategory(InsightCategory category)
        {
            var insights = await _insightService.GetByCategoryAsync(category);
            return Ok(insights);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] InsightCreateDto dto) // Changed from [FromBody] to [FromForm]
        {
            var insight = await _insightService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = insight.Id }, insight);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] InsightUpdateDto dto) // Changed from [FromBody] to [FromForm]
        {
            var insight = await _insightService.UpdateAsync(id, dto);
            if (insight == null) return NotFound();
            return Ok(insight);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _insightService.DeleteAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}