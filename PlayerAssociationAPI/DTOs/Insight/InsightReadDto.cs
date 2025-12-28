namespace PlayerAssociationAPI.DTOs.Insight
{
    public class InsightReadDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty; // Return string to frontend
        public string ImagePath { get; set; } = string.Empty;
    }
}