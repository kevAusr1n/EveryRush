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
    public async Task<ActionResult<AppUser>> ThirdPartySignInUserExistCheck([FromRoute] string email) 
    {
        return await _authService.ThirdPartySignInUserExistCheckAsync(email);
    }

    [HttpPost("signin")]
    public async Task<ActionResult<GetUserResponse>> SignIn([FromBody] SignInRequest request) 
    {
        return await _authService.SignInAsync(request);
    }

    [AllowAnonymous]
    [HttpPost("signup")]
    public async Task<ActionResult<GetUserResponse>> SignUp([FromBody] SignUpRequest request) 
    {
        return await _authService.SignUpAsync(request);
    }
}