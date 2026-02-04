using System;
using System.Collections.Generic;

namespace PlayerAssociationAPI.Models
{
    public class Player
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public List<PlayerImage> Images { get; set; } = new List<PlayerImage>();
        public int Age { get; set; }
        public string Club { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public string Nationality { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
