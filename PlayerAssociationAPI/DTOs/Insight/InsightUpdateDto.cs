using Microsoft.AspNetCore.Http;

namespace PlayerAssociationAPI.DTOs.Insight
{
    public class InsightUpdateDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Content { get; set; }
        public string? Author { get; set; }
        public string? Category { get; set; } // Accept string from frontend
        public List<IFormFile>? ImageFiles { get; set; }
    }
}