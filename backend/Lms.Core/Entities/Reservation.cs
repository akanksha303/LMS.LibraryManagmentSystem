namespace Lms.Core.Entities
{
    public class Reservation
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid BookId { get; set; }
        public DateTime ReservationDate { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "Pending"; // Pending, Fulfilled, Cancelled, Expired

        // Navigation properties
        public virtual User? User { get; set; }
        public virtual Book? Book { get; set; }
    }
}
