using Dapper;
using System.Data;
using System.Text.Json;

namespace Server.Data.Helpers
{
    public class JsonTypeHandler : SqlMapper.ITypeHandler
    {
        public object? Parse(Type destinationType, object value)
        {
            return JsonSerializer.Deserialize((string)value, destinationType);
        }

        public void SetValue(IDbDataParameter parameter, object value)
        {
            parameter.Value = JsonSerializer.Serialize(value);
        }
    }
}
