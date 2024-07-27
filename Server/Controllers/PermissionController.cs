using GraphQL;
using Microsoft.AspNetCore.Mvc;
using Server.Data;

namespace Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class PermissionController : ControllerBase
    {
        [HttpGet("GetAll")]
        public IEnumerable<string> GetAll() => InMemoryStorage.GetPermissions();
    }
}