using Lms.Core.Entities;

namespace Lms.Core.Interfaces
{
    public interface IBorrowingTransactionRepository : IRepository<BorrowingTransaction>
    {
        Task<IEnumerable<BorrowingTransaction>> GetActiveLoansByUserIdAsync(Guid userId);
        Task<IEnumerable<BorrowingTransaction>> GetOverdueLoansAsync();
        Task<IEnumerable<BorrowingTransaction>> GetRecentTransactionsAsync(int count);
    }
}
