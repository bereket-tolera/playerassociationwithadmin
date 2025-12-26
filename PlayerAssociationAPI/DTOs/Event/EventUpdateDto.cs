namespace PlayerAssociationAPI.DTOs.Event
{
    public class EventUpdateDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? ImagePath { get; set; }
        public DateTime? EventDate { get; set; }
        public string? Location { get; set; }
    }
}
