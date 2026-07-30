namespace Lms.Application.DTOs
{
    public class DashboardStatsDto
    {
        public int TotalBooks { get; set; }
        public int AvailableBooks { get; set; }
        public int IssuedBooks { get; set; }
        public int TotalMembers { get; set; }
        public decimal PendingFines { get; set; }
        public IEnumerable<BookPopularityDto> MostBorrowedBooks { get; set; } = new List<BookPopularityDto>();
        public IEnumerable<BorrowingTrendDto> MonthlyBorrowingTrends { get; set; } = new List<BorrowingTrendDto>();
        public IEnumerable<ActiveUserDto> ActiveUsers { get; set; } = new List<ActiveUserDto>();
    }

    public class BookPopularityDto
    {
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public int BorrowCount { get; set; }
    }

    public class BorrowingTrendDto
    {
        public string Month { get; set; } = string.Empty; // e.g. "January" or "Jan 2026"
        public int BorrowCount { get; set; }
    }

    public class ActiveUserDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int BooksBorrowedCount { get; set; }
    }
}
