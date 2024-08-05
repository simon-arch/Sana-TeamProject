using Dapper;
using Microsoft.Data.SqlClient;
using Server.Models;

namespace Server.Data.Repositories
{
    public class AppealRepository(DbProvider provider) : IAppealRepository
    {
        private readonly SqlConnection _sql = provider.Connection;

        public Task<IEnumerable<Appeal>> GetAllAsync()
        {
            string query = @"
                SELECT Id, Title, Description, Type, Status, Sender
                FROM Appeals";
            return _sql.QueryAsync<Appeal>(query);
        }

        public Task<IEnumerable<Appeal>> GetAsync(string username)
        {
            string query = @$"
                SELECT Id, Title, Description, Type, Status, Sender
                FROM Appeals
                WHERE Sender='{username}'";
            return _sql.QueryAsync<Appeal>(query);
        }

        public Task<Appeal?> GetAsync(int id)
        {
            string query = @$"
                SELECT Id, Title, Description, Type, Status, Sender 
                FROM Appeals 
                WHERE Id={id}";
            return _sql.QueryFirstOrDefaultAsync<Appeal>(query);
        }

        public Task<int> InsertAsync(Appeal appeal)
        {
            string query = @"
                INSERT INTO Appeals (Title, Description, Type, Status, Sender)
                OUTPUT INSERTED.Id
                VALUES (@Title, @Description, @Type, @Status, @Sender)";
            return _sql.QuerySingleAsync<int>(query, appeal);
        }

        public Task UpdateAsync(Appeal appeal)
        {
            string query = @"
                UPDATE Appeals
                SET Title=@Title, Description=@Description, Type=@Type, Status=@Status, Sender=@Sender
                WHERE Id=@Id";
            return _sql.ExecuteAsync(query, appeal);
        }

        public Task DeleteAsync(int id)
        {
            string query = @$"
                DELETE FROM Appeals
                WHERE Id={id}";
            return _sql.ExecuteAsync(query);
        }
    }
}
