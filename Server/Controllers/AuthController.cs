using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Data;
using System.Security.Claims;

namespace Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        [AllowAnonymous]
        [HttpGet("Login")]
        public IActionResult Login(string username, string password)
        {
            var user = InMemoryStorage.Authenticate(username, password);
            if (user == null) return Unauthorized();

            Claim[] claims = [
                new(ClaimTypes.Name, user.Username),
                new(ClaimTypes.Role, user.Role)
            ];

            HttpContext.SignInAsync(new ClaimsPrincipal(
                new ClaimsIdentity(claims, "cookie")
            ));

            return Ok();
        }

        [HttpGet("Logout")]
        public void Logout() => HttpContext.SignOutAsync("cookie");
    }
}
