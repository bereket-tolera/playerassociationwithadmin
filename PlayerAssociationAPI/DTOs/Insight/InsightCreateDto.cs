using Microsoft.AspNetCore.Http;

namespace PlayerAssociationAPI.DTOs.Insight
{
    public class InsightCreateDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty; // Accept string from frontend
        public IFormFile? ImageFile { get; set; }
    }
}