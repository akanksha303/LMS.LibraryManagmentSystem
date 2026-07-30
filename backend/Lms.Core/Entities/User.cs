using Microsoft.AspNetCore.Identity;

namespace Lms.Core.Entities
{
    public class User : IdentityUser<Guid>
    {
        public string Name { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public DateTime MembershipDate { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "Active"; // Active, Suspended, Expired

        // Navigation properties
        public virtual ICollection<BorrowingTransaction> BorrowingTransactions { get; set; } = new List<BorrowingTransaction>();
        public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
        public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
