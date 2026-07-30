using Lms.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Lms.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FinesController : ControllerBase
    {
        private readonly IFineService _fineService;

        public FinesController(IFineService fineService)
        {
            _fineService = fineService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyFines()
        {
            var userIdVal = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdVal)) return Unauthorized();

            var fines = await _fineService.GetUserFinesAsync(Guid.Parse(userIdVal));
            return Ok(fines);
        }

        [HttpGet("user/{userId}")]
        [Authorize(Roles = "Admin,Librarian")]
        public async Task<IActionResult> GetUserFines(Guid userId)
        {
            var fines = await _fineService.GetUserFinesAsync(userId);
            return Ok(fines);
        }

        [HttpPost("pay/{fineId}")]
        public async Task<IActionResult> PayFine(Guid fineId)
        {
            var success = await _fineService.PayFineAsync(fineId);
            if (!success)
            {
                return BadRequest(new { error = "Fine already paid or not found." });
            }
            return Ok(new { message = "Fine paid successfully." });
        }
    }
}
