using Microsoft.AspNetCore.Http;

namespace PlayerAssociationAPI.DTOs.Player
{
    public class PlayerUpdateDto
    {
        public string? FullName { get; set; }
        public int? Age { get; set; }
        public string? Club { get; set; }
        public string? Position { get; set; }
        public string? Nationality { get; set; }
        public string? Description { get; set; }

        // Optional new image
        public IFormFile? ImageFile { get; set; }
    }
}
