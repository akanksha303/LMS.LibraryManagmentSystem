using Lms.Application.DTOs;
using Lms.Application.Interfaces;
using Lms.Core.Entities;
using Lms.Core.Interfaces;

namespace Lms.Application.Services
{
    public class ReservationService : IReservationService
    {
        private readonly IRepository<Reservation> _reservationRepository;
        private readonly IBookRepository _bookRepository;
        private readonly IRepository<User> _userRepository;

        public ReservationService(
            IRepository<Reservation> reservationRepository,
            IBookRepository bookRepository,
            IRepository<User> userRepository)
        {
            _reservationRepository = reservationRepository;
            _bookRepository = bookRepository;
            _userRepository = userRepository;
        }

        public async Task<ReservationDto> ReserveBookAsync(ReservationCreateDto dto)
        {
            var book = await _bookRepository.GetByIdAsync(dto.BookId);
            if (book == null)
            {
                throw new KeyNotFoundException("Book not found.");
            }

            var user = await _userRepository.GetByIdAsync(dto.UserId);
            if (user == null)
            {
                throw new KeyNotFoundException("User not found.");
            }

            // Block reserving books that are already available
            if (book.AvailableCopies > 0)
            {
                throw new InvalidOperationException("This book is currently available for borrowing. You do not need to reserve it.");
            }

            // Check if user already has a pending reservation for this book
            var existing = await _reservationRepository.FindAsync(r => r.BookId == dto.BookId && r.UserId == dto.UserId && r.Status == "Pending");
            if (existing.Any())
            {
                throw new InvalidOperationException("You already have a pending reservation for this book.");
            }

            var reservation = new Reservation
            {
                Id = Guid.NewGuid(),
                BookId = dto.BookId,
                UserId = dto.UserId,
                ReservationDate = DateTime.UtcNow,
                Status = "Pending"
            };

            await _reservationRepository.AddAsync(reservation);
            await _reservationRepository.SaveChangesAsync();

            return new ReservationDto
            {
                Id = reservation.Id,
                UserId = reservation.UserId,
                UserName = user.Name,
                BookId = reservation.BookId,
                BookTitle = book.Title,
                ReservationDate = reservation.ReservationDate,
                Status = reservation.Status
            };
        }

        public async Task<bool> CancelReservationAsync(Guid reservationId)
        {
            var reservation = await _reservationRepository.GetByIdAsync(reservationId);
            if (reservation == null || reservation.Status != "Pending") return false;

            reservation.Status = "Cancelled";
            _reservationRepository.Update(reservation);
            var result = await _reservationRepository.SaveChangesAsync();
            return result > 0;
        }

        public async Task<IEnumerable<ReservationDto>> GetUserReservationsAsync(Guid userId)
        {
            var reservations = await _reservationRepository.FindAsync(r => r.UserId == userId);
            var dtos = new List<ReservationDto>();

            foreach (var r in reservations)
            {
                var book = await _bookRepository.GetByIdAsync(r.BookId);
                var user = await _userRepository.GetByIdAsync(r.UserId);

                dtos.Add(new ReservationDto
                {
                    Id = r.Id,
                    UserId = r.UserId,
                    UserName = user?.Name ?? "Unknown",
                    BookId = r.BookId,
                    BookTitle = book?.Title ?? "Unknown Book",
                    ReservationDate = r.ReservationDate,
                    Status = r.Status
                });
            }

            return dtos.OrderByDescending(r => r.ReservationDate);
        }

        public async Task<IEnumerable<ReservationDto>> GetBookReservationsAsync(Guid bookId)
        {
            var reservations = await _reservationRepository.FindAsync(r => r.BookId == bookId);
            var dtos = new List<ReservationDto>();

            foreach (var r in reservations)
            {
                var book = await _bookRepository.GetByIdAsync(r.BookId);
                var user = await _userRepository.GetByIdAsync(r.UserId);

                dtos.Add(new ReservationDto
                {
                    Id = r.Id,
                    UserId = r.UserId,
                    UserName = user?.Name ?? "Unknown",
                    BookId = r.BookId,
                    BookTitle = book?.Title ?? "Unknown Book",
                    ReservationDate = r.ReservationDate,
                    Status = r.Status
                });
            }

            return dtos.OrderByDescending(r => r.ReservationDate);
        }

        public async Task<IEnumerable<ReservationDto>> GetAllReservationsAsync()
        {
            var reservations = await _reservationRepository.GetAllAsync();
            var dtos = new List<ReservationDto>();

            foreach (var r in reservations)
            {
                var book = await _bookRepository.GetByIdAsync(r.BookId);
                var user = await _userRepository.GetByIdAsync(r.UserId);

                dtos.Add(new ReservationDto
                {
                    Id = r.Id,
                    UserId = r.UserId,
                    UserName = user?.Name ?? "Unknown",
                    BookId = r.BookId,
                    BookTitle = book?.Title ?? "Unknown Book",
                    ReservationDate = r.ReservationDate,
                    Status = r.Status
                });
            }

            return dtos.OrderByDescending(r => r.ReservationDate);
        }
    }
}
