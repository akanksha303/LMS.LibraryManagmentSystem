using Lms.Core.Entities;

namespace Lms.Core.Interfaces
{
    public interface IBookRepository : IRepository<Book>
    {
        Task<(IEnumerable<Book> Books, int TotalCount)> SearchBooksAsync(
            string? search, 
            string? category, 
            bool? onlyAvailable, 
            string? sortBy, 
            bool isDescending, 
            int page, 
            int pageSize);
    }
}
