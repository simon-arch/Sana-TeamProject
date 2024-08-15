using Dapper;
using System.Data;

namespace Server.Data.Helpers
{
    public class GuidTypeHandler : SqlMapper.ITypeHandler
    {
        public object? Parse(Type destinationType, object value)
        {
            return Guid.TryParse(value.ToString(), out var result) 
                ? result 
                : null;
        }

        public void SetValue(IDbDataParameter parameter, object value)
        {
            parameter.Value = value.ToString();
        }
    }
}
