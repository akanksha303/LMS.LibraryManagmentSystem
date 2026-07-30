namespace Lms.Core.Entities
{
    public class Fine
    {
        public Guid Id { get; set; }
        public Guid TransactionId { get; set; }
        public decimal Amount { get; set; }
        public bool IsPaid { get; set; } = false;
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual BorrowingTransaction? BorrowingTransaction { get; set; }
    }
}
