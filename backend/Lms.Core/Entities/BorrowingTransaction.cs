namespace Lms.Core.Entities
{
    public class BorrowingTransaction
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid BookId { get; set; }
        public DateTime IssueDate { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        public string Status { get; set; } = "Issued"; // Issued, Returned, Overdue

        // Navigation properties
        public virtual User? User { get; set; }
        public virtual Book? Book { get; set; }
        public virtual Fine? Fine { get; set; }
    }
}
