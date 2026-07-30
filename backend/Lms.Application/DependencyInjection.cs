using FluentValidation;
using Lms.Application.Interfaces;
using Lms.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Lms.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddScoped<IBookService, BookService>();
            services.AddScoped<IBorrowService, BorrowService>();
            services.AddScoped<IFineService, FineService>();
            services.AddScoped<IReservationService, ReservationService>();
            services.AddScoped<IDashboardService, DashboardService>();
            services.AddScoped<IAIRecommendationService, AIRecommendationService>();

            services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);

            return services;
        }
    }
}
