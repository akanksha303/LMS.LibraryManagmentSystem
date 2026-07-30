using Lms.Application.Interfaces;
using Lms.Core.Interfaces;
using Lms.Infrastructure.Data;
using Lms.Infrastructure.Repositories;
using Lms.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Lms.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            
            // Allow SQLite fallback if specified or if no connection is provided
            if (configuration["UseSQLite"] == "true" || string.IsNullOrWhiteSpace(connectionString))
            {
                services.AddDbContext<LmsDbContext>(options =>
                    options.UseSqlite("Data Source=lms.db"));
            }
            else
            {
                services.AddDbContext<LmsDbContext>(options =>
                    options.UseNpgsql(connectionString));
            }

            // Register repositories
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            services.AddScoped<IBookRepository, BookRepository>();
            services.AddScoped<IBorrowingTransactionRepository, BorrowingTransactionRepository>();

            // Register services
            services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
            services.AddScoped<IEmailService, EmailService>();

            return services;
        }
    }
}
