using EveryRush.Entity;
using EveryRush.Request;
using Microsoft.AspNetCore.Authorization;
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

    [HttpGet("third-party-login-user-exist-check/{email}")]
    public async Task<ActionResult<AppUser>> ThirdPartyLoginUserExistCheck([FromRoute] string email) 
    {
        return await _authService.ThirdPartyLoginUserExistCheckAsync(email);
    }

    [HttpPost("signin")]
    public async Task<ActionResult<GetUserResponse>> Login([FromBody] LoginRequest request) 
    {
        return await _authService.LoginAsync(request);
    }

    [AllowAnonymous]
    [HttpPost("signup")]
    public async Task<ActionResult<GetUserResponse>> Register([FromBody] RegisterRequest request) 
    {
        return await _authService.RegisterAsync(request);
    }
}