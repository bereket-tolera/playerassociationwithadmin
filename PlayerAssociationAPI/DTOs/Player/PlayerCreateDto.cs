using Microsoft.AspNetCore.Http;

namespace PlayerAssociationAPI.DTOs.Player
{
    public class PlayerCreateDto
    {
        public string FullName { get; set; } = string.Empty;
        public int Age { get; set; }
        public string? Club { get; set; }
        public string? Position { get; set; }
        public string? Nationality { get; set; }
        public string? Description { get; set; }
        public List<IFormFile>? ImageFiles { get; set; }
    }
}
