using Lms.Application.DTOs;

namespace Lms.Application.Interfaces
{
    public interface IBorrowService
    {
        Task<BorrowingTransactionDto> IssueBookAsync(BorrowRequestDto request);
        Task<BorrowingTransactionDto?> ReturnBookAsync(Guid transactionId);
        Task<IEnumerable<BorrowingTransactionDto>> GetUserBorrowingHistoryAsync(Guid userId);
        Task<IEnumerable<BorrowingTransactionDto>> GetActiveLoansAsync();
    }
}
