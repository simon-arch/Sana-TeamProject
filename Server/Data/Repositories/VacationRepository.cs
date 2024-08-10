using Dapper;
using Microsoft.Data.SqlClient;
using Server.Models;

namespace Server.Data.Repositories
{
    public class VacationRepository(DbProvider provider) : IVacationRepository
    {
        private readonly SqlConnection _sql = provider.Connection;

        public Task<IEnumerable<Vacation>> GetAllAsync()
        {
            string query = @"
                SELECT Id, Title, Description, Status, Sender, StartDate, EndDate
                FROM Vacations";
            return _sql.QueryAsync<Vacation>(query);
        }

        public Task<IEnumerable<Vacation>> GetAsync(string username)
        {
            string query = @$"
                SELECT Id, Title, Description, Status, Sender, StartDate, EndDate
                FROM Vacations
                WHERE Sender='{username}'";
            return _sql.QueryAsync<Vacation>(query);
        }

        public Task<Vacation?> GetAsync(int id)
        {
            string query = @$"
                SELECT Id, Title, Description, Status, Sender, StartDate, EndDate
                FROM Vacations 
                WHERE Id={id}";
            return _sql.QueryFirstOrDefaultAsync<Vacation>(query);
        }

        public Task<int> InsertAsync(Vacation appeal)
        {
            string query = @"
                INSERT INTO Vacations (Title, Description, Status, Sender, StartDate, EndDate)
                OUTPUT INSERTED.Id
                VALUES (@Title, @Description, @Status, @Sender, @StartDate, @EndDate)";
            return _sql.QuerySingleAsync<int>(query, appeal);
        }

        public Task UpdateAsync(Vacation appeal)
        {
            string query = @"
                UPDATE Vacations
                SET Title=@Title, Description=@Description, Status=@Status, Sender=@Sender, StartDate=@StartDate, EndDate=@EndDate
                WHERE Id=@Id";
            return _sql.ExecuteAsync(query, appeal);
        }

        public Task DeleteAsync(int id)
        {
            string query = @$"
                DELETE FROM Vacations
                WHERE Id={id}";
            return _sql.ExecuteAsync(query);
        }
    }
}
