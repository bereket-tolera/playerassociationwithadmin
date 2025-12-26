using PlayerAssociationAPI.Models;

namespace PlayerAssociationAPI.DTOs.Insight
{
    public class InsightCreateDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public InsightCategory Category { get; set; }
        public string? ImagePath { get; set; }
    }
}
