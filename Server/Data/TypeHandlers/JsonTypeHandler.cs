using System.Data;
using System.Text.Json;
using Dapper;

namespace Server.Data.TypeHandlers;

public class JsonTypeHandler : SqlMapper.ITypeHandler
{
    public object? Parse(Type destinationType, object value)
    {
        return JsonSerializer.Deserialize(value.ToString()!, destinationType);
    }

    public void SetValue(IDbDataParameter parameter, object value)
    {
        parameter.Value = JsonSerializer.Serialize(value);
    }
}