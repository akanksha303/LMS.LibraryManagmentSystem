using Lms.Application.DTOs;
using Lms.Application.Interfaces;
using Lms.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Lms.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole<Guid>> _roleManager;
        private readonly IJwtTokenGenerator _tokenGenerator;

        public AuthController(
            UserManager<User> userManager,
            RoleManager<IdentityRole<Guid>> roleManager,
            IJwtTokenGenerator tokenGenerator)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _tokenGenerator = tokenGenerator;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var existing = await _userManager.FindByEmailAsync(dto.Email);
            if (existing != null)
            {
                return BadRequest(new { error = "Email is already registered." });
            }

            var user = new User
            {
                UserName = dto.Email,
                Email = dto.Email,
                Name = dto.Name,
                PhoneNumber = dto.Phone,
                Department = dto.Department,
                Status = "Active",
                MembershipDate = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {
                return BadRequest(new { errors = result.Errors.Select(e => e.Description) });
            }

            // Ensure requested Role exists
            var roleName = dto.Role;
            if (!new[] { "Admin", "Librarian", "Student" }.Contains(roleName))
            {
                roleName = "Student";
            }

            if (!await _roleManager.RoleExistsAsync(roleName))
            {
                await _roleManager.CreateAsync(new IdentityRole<Guid>(roleName));
            }

            await _userManager.AddToRoleAsync(user, roleName);

            var roles = new List<string> { roleName };
            var token = _tokenGenerator.GenerateToken(user, roles);

            return Ok(new AuthResponseDto
            {
                Token = token,
                Name = user.Name,
                Email = user.Email,
                Role = roleName,
                UserId = user.Id
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
            {
                return Unauthorized(new { error = "Invalid email or password." });
            }

            var isPasswordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!isPasswordValid)
            {
                return Unauthorized(new { error = "Invalid email or password." });
            }

            var roles = await _userManager.GetRolesAsync(user);
            var token = _tokenGenerator.GenerateToken(user, roles);

            return Ok(new AuthResponseDto
            {
                Token = token,
                Name = user.Name,
                Email = user.Email ?? string.Empty,
                Role = roles.FirstOrDefault() ?? "Student",
                UserId = user.Id
            });
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetMe()
        {
            var userIdVal = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdVal)) return Unauthorized();

            var user = await _userManager.FindByIdAsync(userIdVal);
            if (user == null) return NotFound();

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
    }
}
