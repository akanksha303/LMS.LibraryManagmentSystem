using Lms.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lms.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,Librarian")]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<User> _userManager;

        public UsersController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userManager.Users.ToListAsync();
            var result = new List<object>();

            foreach (var u in users)
            {
                var roles = await _userManager.GetRolesAsync(u);
                result.Add(new
                {
                    id = u.Id,
                    name = u.Name,
                    email = u.Email,
                    phone = u.PhoneNumber,
                    department = u.Department,
                    membershipDate = u.MembershipDate,
                    status = u.Status,
                    role = roles.FirstOrDefault() ?? "Student"
                });
            }

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null) return NotFound(new { error = "User not found." });

            var roles = await _userManager.GetRolesAsync(user);
            return Ok(new
            {
                id = user.Id,
                name = user.Name,
                email = user.Email,
                phone = user.PhoneNumber,
                department = user.Department,
                membershipDate = user.MembershipDate,
                status = user.Status,
                role = roles.FirstOrDefault() ?? "Student"
            });
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UserStatusUpdateDto dto)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null) return NotFound(new { error = "User not found." });

            if (!new[] { "Active", "Suspended", "Expired" }.Contains(dto.Status))
            {
                return BadRequest(new { error = "Status must be Active, Suspended, or Expired." });
            }

            user.Status = dto.Status;
            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(new { errors = result.Errors.Select(e => e.Description) });
            }

            return Ok(new { message = "User status updated successfully.", status = user.Status });
        }
    }

    public class UserStatusUpdateDto
    {
        public string Status { get; set; } = string.Empty;
    }
}
