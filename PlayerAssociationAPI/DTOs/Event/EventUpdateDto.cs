using Microsoft.AspNetCore.Http;

namespace PlayerAssociationAPI.DTOs.Event
{
    public class EventUpdateDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public IFormFile? ImageFile { get; set; } // Changed from ImagePath to ImageFile
        public DateTime? EventDate { get; set; }
        public string? Location { get; set; }
    }
}