using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Options;
using Server.Models;

namespace Server.Data.Repositories
{
    public class TimeStampRepository(DbProvider dbProvider) : ITimeStampRepository
    {
        private readonly SqlConnection _sql = dbProvider.Connection;

        private Task<int> _CountAsync(string condition) =>
            _sql.QuerySingleAsync<int>($"SELECT COUNT(*) FROM TimeStamps {condition}");

        public Task<IEnumerable<TimeStamp>> GetAllAsync()
        {
            string query = @"
                SELECT Id, Username, TimeStart, TimeEnd, Source, Editor
                FROM TimeStamps";
            return _sql.QueryAsync<TimeStamp>(query);
        }

        public Task<TimeStamp?> GetAsync(int id)
        {
            string query = @$"
                SELECT Id, Username, TimeStart, TimeEnd, Source, Editor
                FROM TimeStamps
                WHERE Id={id}";
            return _sql.QueryFirstOrDefaultAsync<TimeStamp>(query);
        }

        public Task<IEnumerable<TimeStamp>> GetAsync(string username)
        {
            string query = $@"
                SELECT Id, Username, TimeStart, TimeEnd, Source, Editor
                FROM TimeStamps
                WHERE Username='{username}'";
            return _sql.QueryAsync<TimeStamp>(query);
        }

        public async Task<ResultSet<TimeStamp>> GetAsync(string username, int pageSize, int pageNumber)
        {
            string query = $@"
                SELECT Id, Username, TimeStart, TimeEnd, Source, Editor
                FROM TimeStamps
                WHERE Username = '{username}'
                ORDER BY TimeStart DESC
                OFFSET {(pageNumber - 1) * pageSize} ROWS FETCH NEXT {pageSize} ROWS ONLY";

            return new ResultSet<TimeStamp>
            {
                TotalCount = await _CountAsync($"WHERE Username = '{username}'"),
                Results = await _sql.QueryAsync<TimeStamp>(query)
            };
        }

        public Task<int> InsertAsync(TimeStamp timeStamp)
        {
            string query = @"
                INSERT INTO TimeStamps (Username, TimeStart, TimeEnd, Source, Editor)
                OUTPUT INSERTED.Id
                VALUES (@Username, @TimeStart, @TimeEnd, @Source, @Editor)";
            return _sql.QuerySingleAsync<int>(query, timeStamp);
        }

        public Task DeleteAsync(int id)
        {
            string query = @$"
                DELETE FROM TimeStamps 
                WHERE Id={id}";
            return _sql.ExecuteAsync(query);
        }

        public Task UpdateAsync(TimeStamp timeStamp)
        {
            string query = @"
                UPDATE TimeStamps
                SET Username=@Username, TimeStart=@TimeStart, TimeEnd=@TimeEnd, Source=@Source, Editor=@Editor
                WHERE Id=@Id";
            return _sql.ExecuteAsync(query, timeStamp);
        }

        public Task<TimeStamp?> GetLatestAsync(string username)
        {
            string query = @$"
                SELECT TOP(1) Id, Username, TimeStart, TimeEnd, Source, Editor
                FROM TimeStamps
                WHERE Username = '{username}'
                ORDER BY CASE WHEN TimeEnd IS NULL THEN 0 ELSE 1 END, TimeEnd DESC";
            return _sql.QueryFirstOrDefaultAsync<TimeStamp>(query);
        }
    }
}
