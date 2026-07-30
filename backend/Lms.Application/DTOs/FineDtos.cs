namespace Lms.Application.DTOs
{
    public class FineDto
    {
        public Guid Id { get; set; }
        public Guid TransactionId { get; set; }
        public string BookTitle { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public bool IsPaid { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
