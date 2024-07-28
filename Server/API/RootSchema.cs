using GraphQL.Types;

namespace Server.API
{
    public class RootSchema : Schema
    {
        public RootSchema(IServiceProvider provider)
            : base(provider)
        {
            Query = provider.GetRequiredService<RootQuery>();
            Mutation = provider.GetRequiredService<RootMutation>();
        }
    }
}
