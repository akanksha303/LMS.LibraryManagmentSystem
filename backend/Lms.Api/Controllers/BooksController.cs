using Lms.Application.DTOs;
using Lms.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Lms.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly IBookService _bookService;
        private readonly IAIRecommendationService _recommendationService;

        public BooksController(IBookService bookService, IAIRecommendationService recommendationService)
        {
            _bookService = bookService;
            _recommendationService = recommendationService;
        }

        [HttpGet]
        public async Task<IActionResult> Search(
            [FromQuery] string? search,
            [FromQuery] string? category,
            [FromQuery] bool? onlyAvailable,
            [FromQuery] string? sortBy,
            [FromQuery] bool isDescending = false,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var (books, totalCount) = await _bookService.SearchBooksAsync(search, category, onlyAvailable, sortBy, isDescending, page, pageSize);
            return Ok(new { books, totalCount, page, pageSize });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var book = await _bookService.GetBookByIdAsync(id);
            if (book == null) return NotFound(new { error = "Book not found." });
            return Ok(book);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Librarian")]
        public async Task<IActionResult> Create([FromBody] BookCreateUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var book = await _bookService.CreateBookAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = book.Id }, book);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Librarian")]
        public async Task<IActionResult> Update(Guid id, [FromBody] BookCreateUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var book = await _bookService.UpdateBookAsync(id, dto);
            if (book == null) return NotFound(new { error = "Book not found." });
            return Ok(book);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Librarian")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var success = await _bookService.DeleteBookAsync(id);
            if (!success) return NotFound(new { error = "Book not found." });
            return NoContent();
        }

        [HttpGet("recommendations")]
        [Authorize]
        public async Task<IActionResult> GetRecommendations()
        {
            var userIdVal = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdVal)) return Unauthorized();

            var recommendations = await _recommendationService.GetRecommendationsAsync(Guid.Parse(userIdVal));
            return Ok(recommendations);
        }

        [HttpPost("chat")]
        [Authorize]
        public async Task<IActionResult> Chat([FromBody] ChatMessageDto dto)
        {
            var userIdVal = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdVal)) return Unauthorized();

            var response = await _recommendationService.ChatWithAssistantAsync(userIdVal, dto.Message);
            return Ok(new { response });
        }

        [HttpGet("{id}/reviews")]
        public async Task<IActionResult> GetReviews(Guid id)
        {
            var reviews = await _bookService.GetBookReviewsAsync(id);
            return Ok(reviews);
        }

        [HttpPost("{id}/reviews")]
        [Authorize]
        public async Task<IActionResult> AddReview(Guid id, [FromBody] ReviewInputDto input)
        {
            var userIdVal = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdVal)) return Unauthorized();

            var dto = new ReviewCreateDto
            {
                BookId = id,
                UserId = Guid.Parse(userIdVal),
                Rating = input.Rating,
                Comment = input.Comment
            };

            var review = await _bookService.AddReviewAsync(dto);
            return Ok(review);
        }
    }

    public class ChatMessageDto
    {
        public string Message { get; set; } = string.Empty;
    }

    public class ReviewInputDto
    {
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
    }
}
