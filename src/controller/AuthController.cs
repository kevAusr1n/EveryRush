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
    public async Task<ActionResult<GetUserResponse>> SignInAsync([FromBody] SignInRequest request) 
    {
        return await _authService.SignInAsync(request);      
    }

    [HttpPost("signup")]
    public async Task<ActionResult<SignUpResponse>> SignUpAsync([FromBody] SignUpRequest request) 
    {
        return await _authService.SignUpAsync(request);
    }

    [HttpPost("signup-confirm")]
    public async Task<ActionResult<SignUpConfirmResponse>> SignUpConfirmAsync([FromBody] SignUpConfirmRequest request) 
    {
        return await _authService.SignUpConfirmAsync(request);
    }

    [HttpPost("signout")]
    public async Task<ActionResult<Boolean>> SignOutAsync() 
    {
        return await _authService.SignOutAsync();
    }

    [HttpPost("edit")]
    public async Task<ActionResult<Boolean>> EditUser([FromBody] EditUserRequest request) 
    {
        return await _authService.EditUserAsync(request);
    }

    [HttpPost("send-password-reset-email")]
    public async Task<ActionResult<SendPasswordResetEmailResponse>> SendPasswordResetEmail([FromQuery] string email) 
    {
        return await _authService.SendPasswordResetEmailAsync(email);
    }

    [HttpPost("password-reset")]
    public async Task<ActionResult<ResetPasswordResponse>> ResetPassword([FromBody] ResetPasswordRequest request) 
    {
        return await _authService.ResetPasswordAsync(request);
    }
}