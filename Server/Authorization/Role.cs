using System.Security.Claims;

namespace Server.Authorization
{
    public static class Role
    {
        public const string Developer = "Developer";
        public const string UserManager = "UserManager";

        public static readonly Dictionary<string, HashSet<Permission>> Permissions = new()
        {
            {Developer, [Permission.ViewUsers] },
            {UserManager, [Permission.ViewUsers, Permission.ManageUsers] }
        };

        public static bool HasPermission(this ClaimsPrincipal? user, Permission requiredPermission)
        {
            string? userRole = user?.FindFirst(ClaimTypes.Role)?.Value;

            if (userRole == null)
            {
                return false;
            }

            return Permissions.TryGetValue(userRole, out var userPermissions)
                && userPermissions.Contains(requiredPermission);
        }
    }
}
