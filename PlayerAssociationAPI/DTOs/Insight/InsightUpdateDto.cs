using PlayerAssociationAPI.Models;

namespace PlayerAssociationAPI.DTOs.Insight
{
    public class InsightUpdateDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Content { get; set; }
        public string? Author { get; set; }
        public InsightCategory? Category { get; set; }
        public string? ImagePath { get; set; }
    }
}
