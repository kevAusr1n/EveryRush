using System.Diagnostics.CodeAnalysis;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text.Json.Nodes;
using EveryRush.Entity;
using EveryRush.Request;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;

namespace EveryRush.Controller;

[AllowAnonymous]
[Route("api/user")]
[ApiController]
public class AuthController : ControllerBase 
{
    private readonly AuthService _authService;

    private readonly UserManager<AppUser> _userManager;
    private readonly RoleManager<AppRole> _roleManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly EmailSender _emailSender;

    public AuthController(
        AuthService authService,
        UserManager<AppUser> userManager,
        RoleManager<AppRole> roleManager, 
        SignInManager<AppUser> signInManager,
        EmailSender emailSender) 
    {
        _authService = authService;
        _userManager = userManager;
        _roleManager = roleManager;
        _signInManager = signInManager;
        _emailSender = emailSender;
    }

    [HttpGet("third-party-signin-check")]
    public async Task<ActionResult<ThirdPartySignInCheckResponse>> ThirdPartySignInUserExistCheck(
        [FromQuery][NotNull] string email,
        [FromQuery][NotNull] string token,
        [FromQuery][NotNull] string provider) 
    {
        if (!ThirdPartySignInProviderConfig.FromThirdParty(provider)) 
        {
            return new ThirdPartySignInCheckResponse {
                Result = RequestResult.FAILURE
            };
        }
        
        using (var client = new HttpClient())
        {
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await client.GetAsync("https://www.googleapis.com/oauth2/v3/userinfo");
            if (!response.IsSuccessStatusCode)
            {
                return new ThirdPartySignInCheckResponse {
                    Result = RequestResult.FAILURE
                };
            }
            var jsonResponse = JObject.Parse(await response.Content.ReadAsStringAsync());
            if (jsonResponse.GetValue("email") == null || !email.Equals(jsonResponse.GetValue("email").ToString())) 
            {
                return new ThirdPartySignInCheckResponse {
                    Result = RequestResult.FAILURE
                };
            } 
            AppUser user = await _userManager.FindByEmailAsync(email);
            if (user == null) {
                return new ThirdPartySignInCheckResponse {
                    Result = RequestResult.FAILURE
                };
            }
            var role = await _userManager.GetRolesAsync(user);        
            return new ThirdPartySignInCheckResponse {
                Result = RequestResult.SUCCESS,
                Id = user.Id,
                UserName = user.AlternativeName,
                Email = user.Email,
                Role = role[0],    
                Provider = provider
            };      
        }

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
    public async Task<ActionResult<EditUserInfoResponse>> EditUser([FromBody] EditUserRequest request) 
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