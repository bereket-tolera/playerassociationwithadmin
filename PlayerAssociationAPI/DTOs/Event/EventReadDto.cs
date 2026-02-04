namespace PlayerAssociationAPI.DTOs.Event
{
    public class EventReadDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<string> ImagePaths { get; set; } = new List<string>();
        public DateTime EventDate { get; set; }
        public string Location { get; set; } = string.Empty;
    }
}
