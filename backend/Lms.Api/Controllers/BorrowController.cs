using Lms.Application.DTOs;
using Lms.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Lms.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BorrowController : ControllerBase
    {
        private readonly IBorrowService _borrowService;

        public BorrowController(IBorrowService borrowService)
        {
            _borrowService = borrowService;
        }

        [HttpPost("issue")]
        [Authorize(Roles = "Admin,Librarian")]
        public async Task<IActionResult> Issue([FromBody] BorrowRequestDto request)
        {
            var result = await _borrowService.IssueBookAsync(request);
            return Ok(result);
        }

        [HttpPost("return/{transactionId}")]
        [Authorize(Roles = "Admin,Librarian")]
        public async Task<IActionResult> Return(Guid transactionId)
        {
            var result = await _borrowService.ReturnBookAsync(transactionId);
            if (result == null)
            {
                return BadRequest(new { error = "Transaction not found or already returned." });
            }
            return Ok(result);
        }

        [HttpGet("history")]
        [Authorize]
        public async Task<IActionResult> GetMyHistory()
        {
            var userIdVal = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdVal)) return Unauthorized();

            var history = await _borrowService.GetUserBorrowingHistoryAsync(Guid.Parse(userIdVal));
            return Ok(history);
        }

        [HttpGet("history/{userId}")]
        [Authorize(Roles = "Admin,Librarian")]
        public async Task<IActionResult> GetUserHistory(Guid userId)
        {
            var history = await _borrowService.GetUserBorrowingHistoryAsync(userId);
            return Ok(history);
        }

        [HttpGet("active")]
        [Authorize(Roles = "Admin,Librarian")]
        public async Task<IActionResult> GetActiveLoans()
        {
            var activeLoans = await _borrowService.GetActiveLoansAsync();
            return Ok(activeLoans);
        }
    }
}
