using Microsoft.AspNetCore.Http;

namespace PlayerAssociationAPI.DTOs.Insight
{
    public class InsightCreateDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Content { get; set; }
        public string? Author { get; set; }
        public string Category { get; set; } = string.Empty;
        public List<IFormFile>? ImageFiles { get; set; }
    }
}