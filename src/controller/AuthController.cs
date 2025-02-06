using EveryRush.Entity;
using EveryRush.Request;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace EveryRush.Controller;

[AllowAnonymous]
[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase 
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService) 
    {
        _authService = authService;
    }

    [HttpGet("third-party-login-user-exist-check/{id}")]
    public async Task<ActionResult<AppUser>> ThirdPartyLoginUserExistCheck([FromRoute] string id) 
    {
        return await _authService.ThirdPartyLoginUserExistCheckAsync(id);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AppUser>> Login([FromBody] LoginRequest request) 
    {
        return await _authService.LoginAsync(request);
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<AppUser>> Register([FromBody] RegisterRequest request) 
    {
        return await _authService.RegisterAsync(request);
    }
}