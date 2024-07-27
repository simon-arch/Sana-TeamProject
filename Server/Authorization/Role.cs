using System.Security.Claims;

namespace Server.Authorization
{
    public static class Role
    {
        public const string Developer = "Developer";
        public const string PermissionManager = "Permission Manager";
        public const string RoleManager = "User Manager";

        public static readonly Dictionary<string, HashSet<Permission>> Permissions = new()
        {
            {Developer, [Permission.ViewUsers] },
            {PermissionManager, [Permission.ViewUsers, Permission.ManageUserPermissions] },
            {RoleManager, [Permission.ViewUsers, Permission.ManageUserRoles] }
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
