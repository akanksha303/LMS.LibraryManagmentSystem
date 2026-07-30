using Lms.Application.DTOs;

namespace Lms.Application.Interfaces
{
    public interface IBookService
    {
        Task<BookDto?> GetBookByIdAsync(Guid id);
        Task<(IEnumerable<BookDto> Books, int TotalCount)> SearchBooksAsync(
            string? search,
            string? category,
            bool? onlyAvailable,
            string? sortBy,
            bool isDescending,
            int page,
            int pageSize);
        Task<BookDto> CreateBookAsync(BookCreateUpdateDto dto);
        Task<BookDto?> UpdateBookAsync(Guid id, BookCreateUpdateDto dto);
        Task<bool> DeleteBookAsync(Guid id);
        Task<ReviewDto> AddReviewAsync(ReviewCreateDto dto);
        Task<IEnumerable<ReviewDto>> GetBookReviewsAsync(Guid bookId);
    }
}
