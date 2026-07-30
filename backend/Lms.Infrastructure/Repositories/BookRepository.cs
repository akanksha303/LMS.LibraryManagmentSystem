using Lms.Core.Entities;
using Lms.Core.Interfaces;
using Lms.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Lms.Infrastructure.Repositories
{
    public class BookRepository : Repository<Book>, IBookRepository
    {
        public BookRepository(LmsDbContext context) : base(context)
        {
        }

        public async Task<(IEnumerable<Book> Books, int TotalCount)> SearchBooksAsync(
            string? search,
            string? category,
            bool? onlyAvailable,
            string? sortBy,
            bool isDescending,
            int page,
            int pageSize)
        {
            IQueryable<Book> query = _context.Books;

            // Search filtering (Title, Author, ISBN)
            if (!string.IsNullOrWhiteSpace(search))
            {
                var lowerSearch = search.ToLower();
                query = query.Where(b => b.Title.ToLower().Contains(lowerSearch) ||
                                         b.Author.ToLower().Contains(lowerSearch) ||
                                         b.ISBN.Contains(lowerSearch) ||
                                         b.Publisher.ToLower().Contains(lowerSearch));
            }

            // Category filtering
            if (!string.IsNullOrWhiteSpace(category))
            {
                var lowerCategory = category.ToLower();
                query = query.Where(b => b.Category.ToLower() == lowerCategory);
            }

            // Availability filtering
            if (onlyAvailable == true)
            {
                query = query.Where(b => b.AvailableCopies > 0);
            }

            // Total count
            var totalCount = await query.CountAsync();

            // Sorting
            if (!string.IsNullOrWhiteSpace(sortBy))
            {
                switch (sortBy.ToLower())
                {
                    case "author":
                        query = isDescending ? query.OrderByDescending(b => b.Author) : query.OrderBy(b => b.Author);
                        break;
                    case "isbn":
                        query = isDescending ? query.OrderByDescending(b => b.ISBN) : query.OrderBy(b => b.ISBN);
                        break;
                    case "category":
                        query = isDescending ? query.OrderByDescending(b => b.Category) : query.OrderBy(b => b.Category);
                        break;
                    case "title":
                    default:
                        query = isDescending ? query.OrderByDescending(b => b.Title) : query.OrderBy(b => b.Title);
                        break;
                }
            }
            else
            {
                query = query.OrderBy(b => b.Title);
            }

            // Pagination
            var books = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (books, totalCount);
        }
    }
}
