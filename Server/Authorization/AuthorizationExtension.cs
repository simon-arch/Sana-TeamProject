using GraphQL;

namespace Server.Authorization
{
    public static class AuthorizationExtension
    {
        public static void Authorize(this IResolveFieldContext context)
        {
            var user = context.User;

            if (!user!.Identity!.IsAuthenticated)
            {
                throw new ExecutionError("You are not authorized")
                {
                    Code = ResponseCode.Unauthorized
                };
            }
        }

        public static void WithPermission(this IResolveFieldContext context, Permission permission)
        {
            context.Authorize();

            if (!context.User!.HasClaim("permissions", permission.ToString()))
            {
                throw new ExecutionError($"Required permission {permission}")
                {
                    Code = ResponseCode.Forbidden
                };
            }
        }
        
        public static bool HasPermission(this IResolveFieldContext context, Permission permission)
        {
            try
            {
                context.WithPermission(permission);
                return true;
            }
            catch (ExecutionError)
            {
                return false;
            }
        }
    }
}
