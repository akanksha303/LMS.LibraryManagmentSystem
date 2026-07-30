using Lms.Application.DTOs;
using Lms.Application.Interfaces;
using Lms.Core.Entities;
using Lms.Core.Interfaces;

namespace Lms.Application.Services
{
    public class BookService : IBookService
    {
        private readonly IBookRepository _bookRepository;
        private readonly IRepository<Review> _reviewRepository;
        private readonly IRepository<User> _userRepository;

        public BookService(
            IBookRepository bookRepository,
            IRepository<Review> reviewRepository,
            IRepository<User> userRepository)
        {
            _bookRepository = bookRepository;
            _reviewRepository = reviewRepository;
            _userRepository = userRepository;
        }

        public async Task<BookDto?> GetBookByIdAsync(Guid id)
        {
            var book = await _bookRepository.GetByIdAsync(id);
            if (book == null) return null;

            var reviews = await _reviewRepository.FindAsync(r => r.BookId == id);
            var avgRating = reviews.Any() ? reviews.Average(r => r.Rating) : 0;

            return MapToDto(book, avgRating);
        }

        public async Task<(IEnumerable<BookDto> Books, int TotalCount)> SearchBooksAsync(
            string? search,
            string? category,
            bool? onlyAvailable,
            string? sortBy,
            bool isDescending,
            int page,
            int pageSize)
        {
            var (books, totalCount) = await _bookRepository.SearchBooksAsync(search, category, onlyAvailable, sortBy, isDescending, page, pageSize);

            var bookDtos = new List<BookDto>();
            foreach (var book in books)
            {
                var reviews = await _reviewRepository.FindAsync(r => r.BookId == book.Id);
                var avgRating = reviews.Any() ? reviews.Average(r => r.Rating) : 0;
                bookDtos.Add(MapToDto(book, avgRating));
            }

            return (bookDtos, totalCount);
        }

        public async Task<BookDto> CreateBookAsync(BookCreateUpdateDto dto)
        {
            var book = new Book
            {
                Id = Guid.NewGuid(),
                ISBN = dto.ISBN,
                Title = dto.Title,
                Author = dto.Author,
                Publisher = dto.Publisher,
                Category = dto.Category,
                Edition = dto.Edition,
                Language = dto.Language,
                TotalCopies = dto.TotalCopies,
                AvailableCopies = dto.TotalCopies, // Initially all copies are available
                RackLocation = dto.RackLocation,
                CoverImage = dto.CoverImage
            };

            await _bookRepository.AddAsync(book);
            await _bookRepository.SaveChangesAsync();

            return MapToDto(book, 0);
        }

        public async Task<BookDto?> UpdateBookAsync(Guid id, BookCreateUpdateDto dto)
        {
            var book = await _bookRepository.GetByIdAsync(id);
            if (book == null) return null;

            // Maintain available copies offset if total copies change
            var borrowedCopies = book.TotalCopies - book.AvailableCopies;
            book.TotalCopies = dto.TotalCopies;
            book.AvailableCopies = Math.Max(0, dto.TotalCopies - borrowedCopies);

            book.ISBN = dto.ISBN;
            book.Title = dto.Title;
            book.Author = dto.Author;
            book.Publisher = dto.Publisher;
            book.Category = dto.Category;
            book.Edition = dto.Edition;
            book.Language = dto.Language;
            book.RackLocation = dto.RackLocation;
            book.CoverImage = dto.CoverImage;

            _bookRepository.Update(book);
            await _bookRepository.SaveChangesAsync();

            var reviews = await _reviewRepository.FindAsync(r => r.BookId == id);
            var avgRating = reviews.Any() ? reviews.Average(r => r.Rating) : 0;

            return MapToDto(book, avgRating);
        }

        public async Task<bool> DeleteBookAsync(Guid id)
        {
            var book = await _bookRepository.GetByIdAsync(id);
            if (book == null) return false;

            _bookRepository.Delete(book);
            var result = await _bookRepository.SaveChangesAsync();
            return result > 0;
        }

        public async Task<ReviewDto> AddReviewAsync(ReviewCreateDto dto)
        {
            var user = await _userRepository.GetByIdAsync(dto.UserId);
            var userName = user?.Name ?? "Anonymous";

            var review = new Review
            {
                Id = Guid.NewGuid(),
                BookId = dto.BookId,
                UserId = dto.UserId,
                Rating = dto.Rating,
                Comment = dto.Comment,
                CreatedDate = DateTime.UtcNow
            };

            await _reviewRepository.AddAsync(review);
            await _reviewRepository.SaveChangesAsync();

            return new ReviewDto
            {
                Id = review.Id,
                UserId = review.UserId,
                UserName = userName,
                BookId = review.BookId,
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedDate = review.CreatedDate
            };
        }

        public async Task<IEnumerable<ReviewDto>> GetBookReviewsAsync(Guid bookId)
        {
            var reviews = await _reviewRepository.FindAsync(r => r.BookId == bookId);
            var dtos = new List<ReviewDto>();

            foreach (var r in reviews)
            {
                var user = await _userRepository.GetByIdAsync(r.UserId);
                dtos.Add(new ReviewDto
                {
                    Id = r.Id,
                    UserId = r.UserId,
                    UserName = user?.Name ?? "Anonymous",
                    BookId = r.BookId,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedDate = r.CreatedDate
                });
            }

            return dtos;
        }

        private static BookDto MapToDto(Book book, double avgRating)
        {
            return new BookDto
            {
                Id = book.Id,
                ISBN = book.ISBN,
                Title = book.Title,
                Author = book.Author,
                Publisher = book.Publisher,
                Category = book.Category,
                Edition = book.Edition,
                Language = book.Language,
                TotalCopies = book.TotalCopies,
                AvailableCopies = book.AvailableCopies,
                RackLocation = book.RackLocation,
                CoverImage = book.CoverImage,
                AverageRating = avgRating
            };
        }
    }
}
