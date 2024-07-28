using Microsoft.IdentityModel.Tokens;
using Server.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Server.Services
{
    public class TokenService(IConfiguration configuration)
    {
        public string CreateToken(User user)
        {
            var key = Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!);
            var expiration = double.Parse(configuration["Jwt:ExpirationHours"]!);

            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = GenerateClaimsIdentity(user),
                Expires = DateTime.UtcNow.AddHours(expiration),
                SigningCredentials = new(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256),
                Issuer = configuration["Jwt:Issuer"],
                Audience = configuration["Jwt:Audience"]
            };
            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private static ClaimsIdentity GenerateClaimsIdentity(User user)
        {
            var claims = new List<Claim>
            {
                new("username", user.Username),
                new("role", user.Role.ToString()),
                new("firstname", user.FirstName),
                new("lastname", user.LastName),
            };

            if (user.Permissions != null)
            {
                foreach (var permission in user.Permissions)
                {
                    claims.Add(new("permissions", permission.ToString()));
                }
            }

            return new ClaimsIdentity(claims);
        }
    }
}
