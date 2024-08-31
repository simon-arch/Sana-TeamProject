using Dapper;
using Microsoft.Data.SqlClient;
using Server.Models;

namespace Server.Data.Repositories
{
    public class PlanRepository(DbProvider dbProvider) : IPlanRepository
    {
        private readonly SqlConnection _sql = dbProvider.Connection;

        public Task<Plan?> GetAsync(int id)
        {
            string query = @$"
                SELECT Id, TimeStart, TimeEnd, Owner
                FROM Plans
                WHERE Id={id}";
            return _sql.QueryFirstOrDefaultAsync<Plan>(query);
        }

        public Task<IEnumerable<Plan>> GetAllAsync(string[] usernames)
        {
            string query = $@"
                SELECT Id, TimeStart, TimeEnd, Owner
                FROM Plans
                WHERE Owner='{string.Join("' OR Owner='", usernames)}'";

            return _sql.QueryAsync<Plan>(query);
        }

        public Task<int> InsertAsync(Plan plan)
        {
            string query = @"
                INSERT INTO Plans (TimeStart, TimeEnd, Owner)
                OUTPUT INSERTED.Id
                VALUES (@TimeStart, @TimeEnd, @Owner)";
            return _sql.QuerySingleAsync<int>(query, plan);
        }

        public Task DeleteAsync(int id)
        {
            string query = @$"
                DELETE FROM Plans 
                WHERE Id={id}";
            return _sql.ExecuteAsync(query);
        }

        public Task UpdateAsync(Plan plan)
        {
            string query = @"
                UPDATE Plans
                SET TimeStart=@TimeStart, TimeEnd=@TimeEnd, Owner=@Owner
                WHERE Id=@Id";
            return _sql.ExecuteAsync(query, plan);
        }
    }
}
