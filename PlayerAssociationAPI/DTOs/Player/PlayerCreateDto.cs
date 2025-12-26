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

        // Image will be uploaded separately, so store path
        public string? ImagePath { get; set; }
    }
}

