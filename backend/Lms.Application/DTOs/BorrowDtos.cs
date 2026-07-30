namespace Lms.Application.DTOs
{
    public class BorrowRequestDto
    {
        public Guid UserId { get; set; }
        public Guid BookId { get; set; }
    }

    public class BorrowingTransactionDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public Guid BookId { get; set; }
        public string BookTitle { get; set; } = string.Empty;
        public string BookAuthor { get; set; } = string.Empty;
        public DateTime IssueDate { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal? FineAmount { get; set; }
        public bool? IsFinePaid { get; set; }
    }
}
