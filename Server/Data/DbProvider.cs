using Microsoft.Data.SqlClient;

namespace Server.Data
{
    public class DbProvider(IConfiguration configuration)
    {
        public SqlConnection Connection { get; } = 
            new SqlConnection(configuration.GetConnectionString("Default"));
    }
}
