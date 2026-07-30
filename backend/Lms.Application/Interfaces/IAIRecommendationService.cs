using Lms.Application.DTOs;

namespace Lms.Application.Interfaces
{
    public interface IAIRecommendationService
    {
        Task<IEnumerable<BookDto>> GetRecommendationsAsync(Guid userId);
        Task<string> ChatWithAssistantAsync(string userId, string message);
    }
}
