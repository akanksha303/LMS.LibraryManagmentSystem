using FluentValidation;
using Lms.Application.DTOs;

namespace Lms.Application.Validators
{
    public class RegisterDtoValidator : AbstractValidator<RegisterDto>
    {
        public RegisterDtoValidator()
        {
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
            RuleFor(x => x.Password).NotEmpty().MinimumLength(6);
            RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
            RuleFor(x => x.Phone).NotEmpty().Matches(@"^\+?\d{10,15}$").WithMessage("Invalid phone number format.");
            RuleFor(x => x.Department).NotEmpty().MaximumLength(100);
            RuleFor(x => x.Role).Must(role => new[] { "Student", "Librarian", "Admin" }.Contains(role))
                .WithMessage("Role must be Student, Librarian, or Admin.");
        }
    }
}
