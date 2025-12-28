using Microsoft.AspNetCore.Http;

namespace PlayerAssociationAPI.DTOs.Player
{
    public class PlayerCreateDto
    {
        public string FullName { get; set; } = string.Empty;
        public int Age { get; set; }
        public string Club { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public string Nationality { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        // This will hold the uploaded image file
        public IFormFile? ImageFile { get; set; }
    }
}
