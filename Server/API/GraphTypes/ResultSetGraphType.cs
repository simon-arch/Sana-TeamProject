using GraphQL.Types;
using Server.Models;

namespace Server.API.GraphTypes
{
    public class ResultSetGraphType<T, TGraphType> : ObjectGraphType<ResultSet<T>>
        where TGraphType : IGraphType
    {
        public ResultSetGraphType()
        {
            var nameRaw = typeof(TGraphType).Name;
            var name = nameRaw.Replace("GraphType", string.Empty);

            Name = $"{name}ResultSet";

            Field(rs => rs.TotalCount);
            Field<ListGraphType<TGraphType>>("results");
        }
    }
}
