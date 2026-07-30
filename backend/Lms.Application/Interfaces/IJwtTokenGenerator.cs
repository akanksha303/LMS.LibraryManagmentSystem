using Lms.Core.Entities;

namespace Lms.Application.Interfaces
{
    public interface IJwtTokenGenerator
    {
        string GenerateToken(User user, IList<string> roles);
    }
}
