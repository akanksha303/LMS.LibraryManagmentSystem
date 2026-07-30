using Lms.Application.DTOs;

namespace Lms.Application.Interfaces
{
    public interface IReservationService
    {
        Task<ReservationDto> ReserveBookAsync(ReservationCreateDto dto);
        Task<bool> CancelReservationAsync(Guid reservationId);
        Task<IEnumerable<ReservationDto>> GetUserReservationsAsync(Guid userId);
        Task<IEnumerable<ReservationDto>> GetBookReservationsAsync(Guid bookId);
        Task<IEnumerable<ReservationDto>> GetAllReservationsAsync();
    }
}
