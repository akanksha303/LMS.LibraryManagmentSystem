using Lms.Application.DTOs;

namespace Lms.Application.Interfaces
{
    public interface IFineService
    {
        Task<IEnumerable<FineDto>> GetUserFinesAsync(Guid userId);
        Task<bool> PayFineAsync(Guid fineId);
        Task<decimal> GetTotalPendingFinesAsync();
    }
}
