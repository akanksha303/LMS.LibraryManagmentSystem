using FluentValidation;
using Lms.Application.DTOs;

namespace Lms.Application.Validators
{
    public class BookCreateUpdateDtoValidator : AbstractValidator<BookCreateUpdateDto>
    {
        public BookCreateUpdateDtoValidator()
        {
            RuleFor(x => x.ISBN).NotEmpty().MaximumLength(20);
            RuleFor(x => x.Title).NotEmpty().MaximumLength(250);
            RuleFor(x => x.Author).NotEmpty().MaximumLength(150);
            RuleFor(x => x.Publisher).NotEmpty().MaximumLength(150);
            RuleFor(x => x.Category).NotEmpty().MaximumLength(100);
            RuleFor(x => x.TotalCopies).GreaterThan(0).WithMessage("Total copies must be at least 1.");
            RuleFor(x => x.RackLocation).NotEmpty().MaximumLength(50);
        }
    }
}
