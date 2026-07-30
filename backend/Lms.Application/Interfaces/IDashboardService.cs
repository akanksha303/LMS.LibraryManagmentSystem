using Lms.Application.DTOs;

namespace Lms.Application.Interfaces
{
    public interface IDashboardService
    {
        Task<DashboardStatsDto> GetStatsAsync();
    }
}
