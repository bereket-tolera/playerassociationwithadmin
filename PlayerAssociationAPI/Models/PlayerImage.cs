using System.ComponentModel.DataAnnotations;

namespace PlayerAssociationAPI.Models
{
    public class PlayerImage
    {
        public int Id { get; set; }
        public string ImagePath { get; set; } = string.Empty;
        public int PlayerId { get; set; }
        public Player? Player { get; set; }
    }
}
