using Lms.Application.DTOs;
using Lms.Application.Interfaces;
using Lms.Core.Entities;
using Lms.Core.Interfaces;

namespace Lms.Application.Services
{
    public class AIRecommendationService : IAIRecommendationService
    {
        private readonly IBookRepository _bookRepository;
        private readonly IBorrowingTransactionRepository _transactionRepository;
        private readonly IRepository<Review> _reviewRepository;

        public AIRecommendationService(
            IBookRepository bookRepository,
            IBorrowingTransactionRepository transactionRepository,
            IRepository<Review> reviewRepository)
        {
            _bookRepository = bookRepository;
            _transactionRepository = transactionRepository;
            _reviewRepository = reviewRepository;
        }

        public async Task<IEnumerable<BookDto>> GetRecommendationsAsync(Guid userId)
        {
            var userTransactions = await _transactionRepository.FindAsync(t => t.UserId == userId);
            var allBooks = await _bookRepository.GetAllAsync();

            var borrowedBookIds = userTransactions.Select(t => t.BookId).ToHashSet();
            var borrowedBooks = allBooks.Where(b => borrowedBookIds.Contains(b.Id)).ToList();

            var recommendedBooks = new List<Book>();

            if (borrowedBooks.Any())
            {
                // Recommend based on category overlap
                var favoriteCategories = borrowedBooks
                    .GroupBy(b => b.Category)
                    .OrderByDescending(g => g.Count())
                    .Select(g => g.Key)
                    .ToList();

                foreach (var category in favoriteCategories)
                {
                    var sameCategoryBooks = allBooks
                        .Where(b => b.Category == category && !borrowedBookIds.Contains(b.Id))
                        .Take(3)
                        .ToList();

                    recommendedBooks.AddRange(sameCategoryBooks);
                    if (recommendedBooks.Count >= 5) break;
                }
            }

            // Fallback: If not enough recommendations, pad with popular/new books
            if (recommendedBooks.Count < 5)
            {
                var remainingCount = 5 - recommendedBooks.Count;
                var popularBooks = allBooks
                    .Where(b => !borrowedBookIds.Contains(b.Id) && !recommendedBooks.Select(r => r.Id).Contains(b.Id))
                    .OrderByDescending(b => b.AvailableCopies) // Just a proxy for popularity/availability
                    .Take(remainingCount)
                    .ToList();

                recommendedBooks.AddRange(popularBooks);
            }

            var dtos = new List<BookDto>();
            foreach (var b in recommendedBooks.Take(5))
            {
                var reviews = await _reviewRepository.FindAsync(r => r.BookId == b.Id);
                var avgRating = reviews.Any() ? reviews.Average(r => r.Rating) : 0;
                dtos.Add(new BookDto
                {
                    Id = b.Id,
                    ISBN = b.ISBN,
                    Title = b.Title,
                    Author = b.Author,
                    Publisher = b.Publisher,
                    Category = b.Category,
                    Edition = b.Edition,
                    Language = b.Language,
                    TotalCopies = b.TotalCopies,
                    AvailableCopies = b.AvailableCopies,
                    RackLocation = b.RackLocation,
                    CoverImage = b.CoverImage,
                    AverageRating = avgRating
                });
            }

            return dtos;
        }

        public async Task<string> ChatWithAssistantAsync(string userId, string message)
        {
            var cleanMessage = message.ToLower();
            var books = await _bookRepository.GetAllAsync();

            if (cleanMessage.Contains("recommend") || cleanMessage.Contains("suggest") || cleanMessage.Contains("book"))
            {
                if (cleanMessage.Contains("java") || cleanMessage.Contains("programming") || cleanMessage.Contains("code"))
                {
                    var programmingBooks = books.Where(b => b.Category.ToLower().Contains("programming") || b.Title.ToLower().Contains("java")).Take(3);
                    if (programmingBooks.Any())
                    {
                        var titles = string.Join(", ", programmingBooks.Select(b => $"'{b.Title}' by {b.Author}"));
                        return $"Here are some programming books available: {titles}. You can search for them in the Catalog!";
                    }
                    return "I couldn't find specific Java books in the library right now, but check out the Science & Tech section in our Catalog!";
                }

                if (cleanMessage.Contains("sci-fi") || cleanMessage.Contains("fiction") || cleanMessage.Contains("dune"))
                {
                    var fictionBooks = books.Where(b => b.Category.ToLower().Contains("fiction") || b.Category.ToLower().Contains("sci-fi")).Take(3);
                    if (fictionBooks.Any())
                    {
                        var titles = string.Join(", ", fictionBooks.Select(b => $"'{b.Title}' by {b.Author}"));
                        return $"If you like sci-fi and fiction, I recommend: {titles}.";
                    }
                }

                var randomBooks = books.OrderBy(x => Guid.NewGuid()).Take(2);
                if (randomBooks.Any())
                {
                    return $"How about checking out: {string.Join(" and ", randomBooks.Select(b => $"'{b.Title}' by {b.Author}"))}?";
                }
            }

            if (cleanMessage.Contains("hello") || cleanMessage.Contains("hi") || cleanMessage.Contains("hey"))
            {
                return "Hello! I am your AI Library Assistant. I can recommend books, check book availability, or help you navigate your account. What are you looking to read today?";
            }

            if (cleanMessage.Contains("fine") || cleanMessage.Contains("payment"))
            {
                return "You can view and settle your pending fines directly from the 'Fines Pending' card or section in your Dashboard.";
            }

            return "I am here to help you manage your library experience! Ask me to recommend books (e.g. 'Recommend books for programming') or query library policies.";
        }
    }
}
