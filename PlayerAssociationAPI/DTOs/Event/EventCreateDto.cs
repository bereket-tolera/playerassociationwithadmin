namespace PlayerAssociationAPI.DTOs.Event
{
    public class EventCreateDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImagePath { get; set; }
        public DateTime EventDate { get; set; }
        public string Location { get; set; } = string.Empty;
    }
}
