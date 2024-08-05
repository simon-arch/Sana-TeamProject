using Microsoft.Data.SqlClient;

namespace Server.Data
{
    public class DbProvider(IConfiguration configuration)
    {
        public SqlConnection Connection =>
            new(configuration.GetConnectionString("Default"));
    }
}
