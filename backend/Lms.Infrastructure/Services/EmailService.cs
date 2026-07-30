using Lms.Application.Interfaces;
using Microsoft.Extensions.Logging;

namespace Lms.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly ILogger<EmailService> _logger;

        public EmailService(ILogger<EmailService> logger)
        {
            _logger = logger;
        }

        public Task SendEmailAsync(string to, string subject, string body)
        {
            _logger.LogInformation("SMTP Email Sent to {To} with Subject: {Subject}. Body Preview: {Body}", to, subject, body);
            return Task.CompletedTask;
        }
    }
}
