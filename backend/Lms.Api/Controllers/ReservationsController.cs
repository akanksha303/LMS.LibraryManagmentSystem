using Lms.Application.DTOs;
using Lms.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Lms.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReservationsController : ControllerBase
    {
        private readonly IReservationService _reservationService;

        public ReservationsController(IReservationService reservationService)
        {
            _reservationService = reservationService;
        }

        [HttpPost]
        public async Task<IActionResult> Reserve([FromBody] ReservationInputDto input)
        {
            var userIdVal = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdVal)) return Unauthorized();

            var dto = new ReservationCreateDto
            {
                BookId = input.BookId,
                UserId = Guid.Parse(userIdVal)
            };

            var reservation = await _reservationService.ReserveBookAsync(dto);
            return Ok(reservation);
        }

        [HttpPost("cancel/{id}")]
        public async Task<IActionResult> Cancel(Guid id)
        {
            var success = await _reservationService.CancelReservationAsync(id);
            if (!success)
            {
                return BadRequest(new { error = "Reservation not found or cannot be cancelled." });
            }
            return Ok(new { message = "Reservation cancelled successfully." });
        }

        [HttpGet]
        public async Task<IActionResult> GetMyReservations()
        {
            var userIdVal = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdVal)) return Unauthorized();

            var reservations = await _reservationService.GetUserReservationsAsync(Guid.Parse(userIdVal));
            return Ok(reservations);
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin,Librarian")]
        public async Task<IActionResult> GetAll()
        {
            var reservations = await _reservationService.GetAllReservationsAsync();
            return Ok(reservations);
        }
    }

    public class ReservationInputDto
    {
        public Guid BookId { get; set; }
    }
}
