using Microsoft.AspNetCore.Http;

namespace PlayerAssociationAPI.DTOs.Event
{
    public class EventCreateDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public IFormFile? ImageFile { get; set; } // Changed from ImagePath to ImageFile
        public DateTime EventDate { get; set; }
        public string Location { get; set; } = string.Empty;
    }
}