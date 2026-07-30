using Lms.Application.DTOs;
using Lms.Application.Interfaces;
using Lms.Core.Entities;
using Lms.Core.Interfaces;

namespace Lms.Application.Services
{
    public class BorrowService : IBorrowService
    {
        private readonly IBorrowingTransactionRepository _transactionRepository;
        private readonly IBookRepository _bookRepository;
        private readonly IRepository<User> _userRepository;
        private readonly IRepository<Fine> _fineRepository;
        private readonly IEmailService _emailService;

        private const int MaxBorrowedBooks = 5;
        private const int BorrowDays = 14;
        private const decimal FinePerDay = 1.00m;

        public BorrowService(
            IBorrowingTransactionRepository transactionRepository,
            IBookRepository bookRepository,
            IRepository<User> userRepository,
            IRepository<Fine> fineRepository,
            IEmailService emailService)
        {
            _transactionRepository = transactionRepository;
            _bookRepository = bookRepository;
            _userRepository = userRepository;
            _fineRepository = fineRepository;
            _emailService = emailService;
        }

        public async Task<BorrowingTransactionDto> IssueBookAsync(BorrowRequestDto request)
        {
            // 1. Verify User exists
            var user = await _userRepository.GetByIdAsync(request.UserId);
            if (user == null)
            {
                throw new KeyNotFoundException("User not found.");
            }

            // 2. Verify Book exists and is available
            var book = await _bookRepository.GetByIdAsync(request.BookId);
            if (book == null)
            {
                throw new KeyNotFoundException("Book not found.");
            }

            if (book.AvailableCopies <= 0)
            {
                throw new InvalidOperationException("Book is currently out of stock/unavailable.");
            }

            // 3. Verify borrowing limits
            var activeLoans = await _transactionRepository.GetActiveLoansByUserIdAsync(request.UserId);
            if (activeLoans.Count() >= MaxBorrowedBooks)
            {
                throw new InvalidOperationException($"Member has reached the maximum borrowing limit of {MaxBorrowedBooks} books.");
            }

            // 4. Create Transaction
            var transaction = new BorrowingTransaction
            {
                Id = Guid.NewGuid(),
                UserId = request.UserId,
                BookId = request.BookId,
                IssueDate = DateTime.UtcNow,
                DueDate = DateTime.UtcNow.AddDays(BorrowDays),
                Status = "Issued"
            };

            // 5. Update Inventory
            book.AvailableCopies--;
            _bookRepository.Update(book);

            await _transactionRepository.AddAsync(transaction);
            await _transactionRepository.SaveChangesAsync();

            // Send notification
            await _emailService.SendEmailAsync(
                user.Email ?? "member@library.com",
                "Book Issued successfully",
                $"You have borrowed '{book.Title}' by {book.Author}. It is due on {transaction.DueDate:MMMM dd, yyyy}."
            );

            return MapToDto(transaction, user.Name, user.Email ?? string.Empty, book.Title, book.Author);
        }

        public async Task<BorrowingTransactionDto?> ReturnBookAsync(Guid transactionId)
        {
            var transaction = await _transactionRepository.GetByIdAsync(transactionId);
            if (transaction == null || transaction.Status == "Returned")
            {
                return null;
            }

            var book = await _bookRepository.GetByIdAsync(transaction.BookId);
            var user = await _userRepository.GetByIdAsync(transaction.UserId);

            if (book == null || user == null)
            {
                throw new KeyNotFoundException("Associated book or user not found.");
            }

            // 1. Process Return
            transaction.ReturnDate = DateTime.UtcNow;
            transaction.Status = "Returned";

            // 2. Update Inventory
            book.AvailableCopies = Math.Min(book.TotalCopies, book.AvailableCopies + 1);
            _bookRepository.Update(book);

            // 3. Fine Calculation
            decimal fineAmount = 0;
            if (transaction.ReturnDate.Value > transaction.DueDate)
            {
                var lateTimeSpan = transaction.ReturnDate.Value - transaction.DueDate;
                var lateDays = (int)Math.Ceiling(lateTimeSpan.TotalDays);
                if (lateDays > 0)
                {
                    fineAmount = lateDays * FinePerDay;
                    var fine = new Fine
                    {
                        Id = Guid.NewGuid(),
                        TransactionId = transaction.Id,
                        Amount = fineAmount,
                        IsPaid = false,
                        CreatedDate = DateTime.UtcNow
                    };
                    await _fineRepository.AddAsync(fine);
                    transaction.Fine = fine;
                }
            }

            _transactionRepository.Update(transaction);
            await _transactionRepository.SaveChangesAsync();

            await _emailService.SendEmailAsync(
                user.Email ?? "member@library.com",
                "Book Returned",
                $"Thank you for returning '{book.Title}'. " + (fineAmount > 0 ? $"A fine of ${fineAmount:0.00} has been registered to your account for late return." : "No fines pending.")
            );

            return MapToDto(transaction, user.Name, user.Email ?? string.Empty, book.Title, book.Author);
        }

        public async Task<IEnumerable<BorrowingTransactionDto>> GetUserBorrowingHistoryAsync(Guid userId)
        {
            var transactions = await _transactionRepository.FindAsync(t => t.UserId == userId);
            var dtos = new List<BorrowingTransactionDto>();

            foreach (var t in transactions)
            {
                var book = await _bookRepository.GetByIdAsync(t.BookId);
                var user = await _userRepository.GetByIdAsync(t.UserId);
                var fine = t.Fine; // EF Core loading, or fetch fine
                if (fine == null)
                {
                    var fines = await _fineRepository.FindAsync(f => f.TransactionId == t.Id);
                    fine = fines.FirstOrDefault();
                }

                dtos.Add(new BorrowingTransactionDto
                {
                    Id = t.Id,
                    UserId = t.UserId,
                    UserName = user?.Name ?? "Unknown",
                    UserEmail = user?.Email ?? string.Empty,
                    BookId = t.BookId,
                    BookTitle = book?.Title ?? "Unknown Book",
                    BookAuthor = book?.Author ?? string.Empty,
                    IssueDate = t.IssueDate,
                    DueDate = t.DueDate,
                    ReturnDate = t.ReturnDate,
                    Status = t.Status,
                    FineAmount = fine?.Amount,
                    IsFinePaid = fine?.IsPaid
                });
            }

            return dtos.OrderByDescending(x => x.IssueDate);
        }

        public async Task<IEnumerable<BorrowingTransactionDto>> GetActiveLoansAsync()
        {
            var transactions = await _transactionRepository.FindAsync(t => t.Status == "Issued" || t.Status == "Overdue");
            var dtos = new List<BorrowingTransactionDto>();

            foreach (var t in transactions)
            {
                var book = await _bookRepository.GetByIdAsync(t.BookId);
                var user = await _userRepository.GetByIdAsync(t.UserId);
                var fines = await _fineRepository.FindAsync(f => f.TransactionId == t.Id);
                var fine = fines.FirstOrDefault();

                dtos.Add(new BorrowingTransactionDto
                {
                    Id = t.Id,
                    UserId = t.UserId,
                    UserName = user?.Name ?? "Unknown",
                    UserEmail = user?.Email ?? string.Empty,
                    BookId = t.BookId,
                    BookTitle = book?.Title ?? "Unknown Book",
                    BookAuthor = book?.Author ?? string.Empty,
                    IssueDate = t.IssueDate,
                    DueDate = t.DueDate,
                    ReturnDate = t.ReturnDate,
                    Status = t.Status,
                    FineAmount = fine?.Amount,
                    IsFinePaid = fine?.IsPaid
                });
            }

            return dtos;
        }

        private static BorrowingTransactionDto MapToDto(BorrowingTransaction t, string userName, string userEmail, string title, string author)
        {
            return new BorrowingTransactionDto
            {
                Id = t.Id,
                UserId = t.UserId,
                UserName = userName,
                UserEmail = userEmail,
                BookId = t.BookId,
                BookTitle = title,
                BookAuthor = author,
                IssueDate = t.IssueDate,
                DueDate = t.DueDate,
                ReturnDate = t.ReturnDate,
                Status = t.Status,
                FineAmount = t.Fine?.Amount,
                IsFinePaid = t.Fine?.IsPaid
            };
        }
    }
}
