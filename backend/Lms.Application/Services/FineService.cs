using Lms.Application.DTOs;
using Lms.Application.Interfaces;
using Lms.Core.Entities;
using Lms.Core.Interfaces;

namespace Lms.Application.Services
{
    public class FineService : IFineService
    {
        private readonly IRepository<Fine> _fineRepository;
        private readonly IBorrowingTransactionRepository _transactionRepository;
        private readonly IBookRepository _bookRepository;

        public FineService(
            IRepository<Fine> fineRepository,
            IBorrowingTransactionRepository transactionRepository,
            IBookRepository bookRepository)
        {
            _fineRepository = fineRepository;
            _transactionRepository = transactionRepository;
            _bookRepository = bookRepository;
        }

        public async Task<IEnumerable<FineDto>> GetUserFinesAsync(Guid userId)
        {
            var userTransactions = await _transactionRepository.FindAsync(t => t.UserId == userId);
            var transactionIds = userTransactions.Select(t => t.Id).ToList();

            var fines = await _fineRepository.FindAsync(f => transactionIds.Contains(f.TransactionId));
            var dtos = new List<FineDto>();

            foreach (var f in fines)
            {
                var trans = userTransactions.First(t => t.Id == f.TransactionId);
                var book = await _bookRepository.GetByIdAsync(trans.BookId);

                dtos.Add(new FineDto
                {
                    Id = f.Id,
                    TransactionId = f.TransactionId,
                    BookTitle = book?.Title ?? "Unknown Book",
                    Amount = f.Amount,
                    IsPaid = f.IsPaid,
                    CreatedDate = f.CreatedDate
                });
            }

            return dtos.OrderByDescending(f => f.CreatedDate);
        }

        public async Task<bool> PayFineAsync(Guid fineId)
        {
            var fine = await _fineRepository.GetByIdAsync(fineId);
            if (fine == null || fine.IsPaid) return false;

            fine.IsPaid = true;
            _fineRepository.Update(fine);
            var result = await _fineRepository.SaveChangesAsync();
            return result > 0;
        }

        public async Task<decimal> GetTotalPendingFinesAsync()
        {
            var pending = await _fineRepository.FindAsync(f => !f.IsPaid);
            return pending.Sum(f => f.Amount);
        }
    }
}
