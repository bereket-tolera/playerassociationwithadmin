using System.ComponentModel.DataAnnotations;

namespace PlayerAssociationAPI.Models
{
    public class EventImage
    {
        public int Id { get; set; }
        public string ImagePath { get; set; } = string.Empty;
        public int EventId { get; set; }
        public Event? Event { get; set; }
    }
}
