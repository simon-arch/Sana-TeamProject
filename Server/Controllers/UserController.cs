using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Data;
using System.Security.Claims;

namespace Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        [HttpGet("GetAll")]
        public IDictionary<string, string> GetUsers() => InMemoryStorage.GetUsers();

        [HttpGet("GetCurrent")]
        public IActionResult GetCurrent()
        {
            var username = HttpContext.User.FindFirst(ClaimTypes.Name)?.Value ?? string.Empty;
            var role = HttpContext.User.FindFirst(ClaimTypes.Role)?.Value ?? string.Empty;

            return Ok(new {
                Username = username,
                Role = role,
                Permissions = InMemoryStorage.GetPermissionsForRole(role)
            });
        }
    }
}
