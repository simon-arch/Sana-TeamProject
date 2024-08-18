﻿using Dapper;
using Microsoft.Data.SqlClient;
using Server.Models;

namespace Server.Data.Repositories
{
    public class PlanRepository(DbProvider dbProvider) : IPlanRepository
    {
        private readonly SqlConnection _sql = dbProvider.Connection;
        public Task<IEnumerable<Plan>> GetAllAsync()
        {
            string query = @"
                SELECT Id, Title, Description, TimeStart, TimeEnd, Owner
                FROM Plans";
            return _sql.QueryAsync<Plan>(query);
        }

        public Task<Plan?> GetAsync(int id)
        {
            string query = @$"
                SELECT Id, Title, Description, TimeStart, TimeEnd, Owner
                FROM Plans
                WHERE Id={id}";
            return _sql.QueryFirstOrDefaultAsync<Plan>(query);
        }

        public Task<IEnumerable<Plan>> GetAsync(string username)
        {
            string query = $@"
                SELECT Id, Title, Description, TimeStart, TimeEnd, Owner
                FROM Plans
                WHERE Owner='{username}'";
            return _sql.QueryAsync<Plan>(query);
        }

        public Task<int> InsertAsync(Plan plan)
        {
            string query = @"
                INSERT INTO Plans (Title, Description, TimeStart, TimeEnd, Owner)
                OUTPUT INSERTED.Id
                VALUES (@Title, @Description, @TimeStart, @TimeEnd, @Owner)";
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
                SET Title=@Title, Description=@Description, TimeStart=@TimeStart, TimeEnd=@TimeEnd, Owner=@Owner
                WHERE Id=@Id";
            return _sql.ExecuteAsync(query, plan);
        }
    }
}
