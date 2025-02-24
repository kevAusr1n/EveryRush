using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.Json.Nodes;
using EveryRush.Entity;
using EveryRush.Request;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace EveryRush.Controller;

[AllowAnonymous]
[Route("api/user")]
[ApiController]
public class AuthController : ControllerBase 
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService) 
    {
        _authService = authService;
    }

    [HttpGet("third-party-login-user-exist-check/{email}")]
    public async Task<ActionResult<AppUser>> ThirdPartySignInUserExistCheck([FromRoute] string email) 
    {
        return await _authService.ThirdPartySignInUserExistCheckAsync(email);
    }

    [HttpPost("signin")]
    public async Task<ActionResult<GetUserResponse>> SignIn([FromBody] SignInRequest request) 
    {
        GetUserResponse response = await _authService.SignInAsync(request);
        // TODO: check if user is valid
        // await setAuthCookie(response);
        if (response.Email != "none") 
        {
            //await setAuthCookie(response);
            //response.Jwt = await GenerateAuthJWT(response);
        }

        return response;
    }

    [HttpPost("signup")]
    public async Task<ActionResult<GetUserResponse>> SignUp([FromBody] SignUpRequest request) 
    {
        GetUserResponse response = await _authService.SignUpAsync(request);
        if (response.Email != "none" && request.doSignInAfterSignUp) 
        {
            //await setAuthCookie(response);
        }
        
        return response;
    }

    [HttpPost("edit")]
    public async Task<ActionResult<Boolean>> EditUser([FromBody] EditUserRequest request) 
    {
        return await _authService.EditUserAsync(request);
    }

    public async Task setAuthCookie(GetUserResponse response) {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, response.Email),
            new Claim("UserName", response.UserName),
            new Claim(ClaimTypes.Role, response.Role)
        };
        var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));
    }

    public async Task<String> GenerateAuthJWT(GetUserResponse response) {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, response.Email),
            new Claim("UserName", response.UserName),
            new Claim(ClaimTypes.Role, response.Role)
        };
        var credentials = new SigningCredentials(new SymmetricSecurityKey(AuthenticationConfig.JWT.Key), SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1), // Token expiration time
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}