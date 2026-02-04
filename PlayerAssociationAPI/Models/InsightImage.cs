using System.ComponentModel.DataAnnotations;

namespace PlayerAssociationAPI.Models
{
    public class InsightImage
    {
        public int Id { get; set; }
        public string ImagePath { get; set; } = string.Empty;
        public int InsightId { get; set; }
        public Insight? Insight { get; set; }
    }
}
