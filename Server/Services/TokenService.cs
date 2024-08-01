using Microsoft.IdentityModel.Tokens;
using Server.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Server.Services
{
    public class TokenService(IConfiguration configuration)
    {
        private readonly JwtSecurityTokenHandler _tokenHandler = new();

        public static TokenValidationParameters GetValidationParameters(IConfiguration config)
        {
            return new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = config["Jwt:Issuer"],
                ValidAudience = config["Jwt:Audience"],
                IssuerSigningKeys = [
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:AccessSecret"]!)),
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:RefreshSecret"]!))
                ],
                ClockSkew = TimeSpan.Zero
            };
        }

        public Guid? ValidateRefreshToken(string token)
        {
            try
            {
                var principal = _tokenHandler.ValidateToken(token, GetValidationParameters(configuration), out _);
                string? id = principal.FindFirst(JwtRegisteredClaimNames.Jti)?.Value;

                return id != null 
                    ? Guid.Parse(id)
                    : null;
            }
            catch { }

            return null;
        }

        public string GenerateAccessToken(User user)
        {
            var claims = new List<Claim> { 
                new(JwtRegisteredClaimNames.Sub, user.Username),
            };
            foreach (var permission in user.Permissions)
            {
                claims.Add(new("permissions", permission.ToString()));
            }

            var expiration = double.Parse(configuration["Jwt:AccessExpireMinutes"]!);
            var secret = Encoding.UTF8.GetBytes(configuration["Jwt:AccessSecret"]!);

            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(expiration),
                SigningCredentials = new(new SymmetricSecurityKey(secret), SecurityAlgorithms.HmacSha256),
                Issuer = configuration["Jwt:Issuer"],
                Audience = configuration["Jwt:Audience"]
            };

            var token = _tokenHandler.CreateToken(tokenDescriptor);

            return _tokenHandler.WriteToken(token);
        }

        private (Guid id, string token) GenerateRefreshToken()
        {
            Guid tokenId = Guid.NewGuid();

            Claim[] claims = [ 
                new(JwtRegisteredClaimNames.Jti, tokenId.ToString()) 
            ];

            var expiration = double.Parse(configuration["Jwt:RefreshExpireDays"]!);
            var secret = Encoding.UTF8.GetBytes(configuration["Jwt:RefreshSecret"]!);

            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(expiration),
                SigningCredentials = new(new SymmetricSecurityKey(secret), SecurityAlgorithms.HmacSha256),
                Issuer = configuration["Jwt:Issuer"],
                Audience = configuration["Jwt:Audience"]
            };

            var token = _tokenHandler.CreateToken(tokenDescriptor);

            return (tokenId, _tokenHandler.WriteToken(token));
        }

        public Guid SetRefreshTokenToCookie(HttpContext context)
        {
            var expiration = double.Parse(configuration["Jwt:RefreshExpireDays"]!);
            var (id, token) = GenerateRefreshToken();

            context.Response.Cookies.Append("jwt", token,
                new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    MaxAge = TimeSpan.FromDays(expiration)
                });

            return id;
        }

        public string? GetRefreshTokenFromCookie(HttpContext context) =>
            context.Request.Cookies["jwt"];
    }
}
