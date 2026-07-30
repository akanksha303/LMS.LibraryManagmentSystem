namespace Lms.Application.DTOs
{
    public class BookDto
    {
        public Guid Id { get; set; }
        public string ISBN { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string Publisher { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Edition { get; set; } = string.Empty;
        public string Language { get; set; } = string.Empty;
        public int TotalCopies { get; set; }
        public int AvailableCopies { get; set; }
        public string RackLocation { get; set; } = string.Empty;
        public string CoverImage { get; set; } = string.Empty;
        public double AverageRating { get; set; }
    }

    public class BookCreateUpdateDto
    {
        public string ISBN { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string Publisher { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Edition { get; set; } = string.Empty;
        public string Language { get; set; } = string.Empty;
        public int TotalCopies { get; set; }
        public string RackLocation { get; set; } = string.Empty;
        public string CoverImage { get; set; } = string.Empty;
    }
}
