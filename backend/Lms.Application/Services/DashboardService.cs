using Lms.Application.DTOs;
using Lms.Application.Interfaces;
using Lms.Core.Entities;
using Lms.Core.Interfaces;

namespace Lms.Application.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly IBookRepository _bookRepository;
        private readonly IBorrowingTransactionRepository _transactionRepository;
        private readonly IRepository<User> _userRepository;
        private readonly IRepository<Fine> _fineRepository;

        public DashboardService(
            IBookRepository bookRepository,
            IBorrowingTransactionRepository transactionRepository,
            IRepository<User> userRepository,
            IRepository<Fine> fineRepository)
        {
            _bookRepository = bookRepository;
            _transactionRepository = transactionRepository;
            _userRepository = userRepository;
            _fineRepository = fineRepository;
        }

        public async Task<DashboardStatsDto> GetStatsAsync()
        {
            var books = await _bookRepository.GetAllAsync();
            var totalBooks = books.Sum(b => b.TotalCopies);
            var availableBooks = books.Sum(b => b.AvailableCopies);

            var transactions = await _transactionRepository.GetAllAsync();
            var activeLoans = transactions.Where(t => t.Status == "Issued" || t.Status == "Overdue").Count();

            var users = await _userRepository.GetAllAsync();
            var totalMembers = users.Count(); // In practice, filter by Student role, but this is fine

            var fines = await _fineRepository.GetAllAsync();
            var pendingFines = fines.Where(f => !f.IsPaid).Sum(f => f.Amount);

            // 1. Most Borrowed Books
            var mostBorrowed = transactions
                .GroupBy(t => t.BookId)
                .Select(g => new { BookId = g.Key, Count = g.Count() })
                .OrderByDescending(x => x.Count)
                .Take(5)
                .ToList();

            var mostBorrowedDtos = new List<BookPopularityDto>();
            foreach (var item in mostBorrowed)
            {
                var book = books.FirstOrDefault(b => b.Id == item.BookId);
                if (book != null)
                {
                    mostBorrowedDtos.Add(new BookPopularityDto
                    {
                        Title = book.Title,
                        Author = book.Author,
                        BorrowCount = item.Count
                    });
                }
            }

            // 2. Monthly Borrowing Trends
            var trends = transactions
                .GroupBy(t => new { t.IssueDate.Year, t.IssueDate.Month })
                .Select(g => new BorrowingTrendDto
                {
                    Month = $"{System.Globalization.CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(g.Key.Month)} {g.Key.Year}",
                    BorrowCount = g.Count()
                })
                .OrderBy(x => DateTime.ParseExact(x.Month, "MMM yyyy", null))
                .Take(12)
                .ToList();

            // 3. Active Users
            var activeUsers = transactions
                .GroupBy(t => t.UserId)
                .Select(g => new { UserId = g.Key, Count = g.Count() })
                .OrderByDescending(x => x.Count)
                .Take(5)
                .ToList();

            var activeUserDtos = new List<ActiveUserDto>();
            foreach (var item in activeUsers)
            {
                var user = users.FirstOrDefault(u => u.Id == item.UserId);
                if (user != null)
                {
                    activeUserDtos.Add(new ActiveUserDto
                    {
                        Name = user.Name,
                        Email = user.Email ?? string.Empty,
                        BooksBorrowedCount = item.Count
                    });
                }
            }

            return new DashboardStatsDto
            {
                TotalBooks = totalBooks,
                AvailableBooks = availableBooks,
                IssuedBooks = activeLoans,
                TotalMembers = totalMembers,
                PendingFines = pendingFines,
                MostBorrowedBooks = mostBorrowedDtos,
                MonthlyBorrowingTrends = trends,
                ActiveUsers = activeUserDtos
            };
        }
    }
}
