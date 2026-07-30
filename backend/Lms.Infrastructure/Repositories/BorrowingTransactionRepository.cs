using Lms.Core.Entities;
using Lms.Core.Interfaces;
using Lms.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Lms.Infrastructure.Repositories
{
    public class BorrowingTransactionRepository : Repository<BorrowingTransaction>, IBorrowingTransactionRepository
    {
        public BorrowingTransactionRepository(LmsDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<BorrowingTransaction>> GetActiveLoansByUserIdAsync(Guid userId)
        {
            return await _context.BorrowingTransactions
                .Include(t => t.Book)
                .Where(t => t.UserId == userId && (t.Status == "Issued" || t.Status == "Overdue"))
                .ToListAsync();
        }

        public async Task<IEnumerable<BorrowingTransaction>> GetOverdueLoansAsync()
        {
            return await _context.BorrowingTransactions
                .Include(t => t.Book)
                .Include(t => t.User)
                .Where(t => t.Status == "Issued" && t.DueDate < DateTime.UtcNow)
                .ToListAsync();
        }

        public async Task<IEnumerable<BorrowingTransaction>> GetRecentTransactionsAsync(int count)
        {
            return await _context.BorrowingTransactions
                .Include(t => t.Book)
                .Include(t => t.User)
                .OrderByDescending(t => t.IssueDate)
                .Take(count)
                .ToListAsync();
        }
    }
}
