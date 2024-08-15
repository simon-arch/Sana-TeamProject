using Server.Data.Repositories;
using Server.Models;

namespace Server.Data.Extensions
{
    public static class UserRepositoryExtensions
    {
        public static async Task<ResultSet<User>> GetAllAsync(this IUserRepository repository, Action<GetAllOptionsBuilder> configure)
        {
            var builder = new GetAllOptionsBuilder();
            configure(builder);
            var options = builder.Build();
            return await repository.GetAllAsync(options);
        }
    }
}
