using System.Diagnostics.CodeAnalysis;
using System.Net.Http.Headers;
using System.Reflection.Metadata;
using EveryRush.Entity;
using EveryRush.Request;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using Newtonsoft.Json.Linq;

namespace EveryRush.Controller;

[AllowAnonymous]
[Route("api/user")]
[ApiController]
public class AuthController : ControllerBase 
{
    private readonly UserManager<AppUser> _userManager;
    private readonly RoleManager<AppRole> _roleManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly EmailSender _emailSender;

    public AuthController(
        UserManager<AppUser> userManager,
        RoleManager<AppRole> roleManager, 
        SignInManager<AppUser> signInManager,
        EmailSender emailSender) 
    {
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
        AppUser user = await _userManager.FindByEmailAsync(email);
        if (user == null) {
            return new ThirdPartySignInCheckResponse {
                Result = ApiResponseDefinition.Result.FAILURE,
                FailureDescription = ApiResponseDefinition.Failure.UserRelatedFailure.THIRD_PARTY_USER_FIRSTTIME_SIGNIN
            };
        }

        if (ThirdPartyAuthDefinition.FromGoogle(provider) && await ValidateGoogleToken(email, token))  
        {
            var thisUser = await _userManager.FindByEmailAsync(email);
            var thisUserRole = await _userManager.GetRolesAsync(user);
            await _signInManager.SignInAsync(user, true);
            
            return new ThirdPartySignInCheckResponse {
                Result = ApiResponseDefinition.Result.SUCCESS,
                Id = thisUser.Id,
                UserName = thisUser.AlternativeName,
                Email = thisUser.Email,
                Role = thisUserRole[0],    
                Provider = provider
            };   
        }   

        return new ThirdPartySignInCheckResponse {
            Result = ApiResponseDefinition.Result.FAILURE,
            FailureDescription = ApiResponseDefinition.Failure.UserRelatedFailure.INVALID_AUTH_TOKEN
        };
    }

    [HttpPost("signin")]
    public async Task<ActionResult<SignInResponse>> SignIn([FromBody] SignInRequest request) 
    {
        if (!String.IsNullOrEmpty(request.Provider)) 
        {
            return new SignInResponse {
                Result = ApiResponseDefinition.Result.FAILURE,
                FailureDescription = ApiResponseDefinition.Failure.GeneralFailure.INVALID_REQUEST
            };
        }
        AppUser user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null) 
        {
            return new SignInResponse {
                Result = ApiResponseDefinition.Result.FAILURE,
                FailureDescription = ApiResponseDefinition.Failure.UserRelatedFailure.USER_NOT_EXIST
            };
        }


        if (request.ConfirmRequired && !await _userManager.IsEmailConfirmedAsync(user)) 
        {
            return new SignInResponse {
                Result = ApiResponseDefinition.Result.FAILURE,
                FailureDescription = ApiResponseDefinition.Failure.UserRelatedFailure.EMAIL_NOT_CONFIRMED
            };
        }
        var result = await _signInManager.PasswordSignInAsync(request.Email, request.Password, true, false);
        if (result.Succeeded) 
        {   
            var role = await _userManager.GetRolesAsync(user);
            return new SignInResponse {
                Result = ApiResponseDefinition.Result.SUCCESS,
                Id = user.Id,
                Email = user.Email,
                UserName = user.AlternativeName,
                Role = role[0]
            };
        }
        else 
        {
            return new SignInResponse {
                Result = ApiResponseDefinition.Result.FAILURE,
                FailureDescription = ApiResponseDefinition.Failure.UserRelatedFailure.SIGN_INFO_INCORRECT
            };
        }
    }

    [HttpPost("signup")]
    public async Task<ActionResult<SignUpResponse>> SignUp([FromBody] SignUpRequest request) 
    {
        if (await _userManager.FindByEmailAsync(request.Email) != null) {
            return new SignUpResponse {
                Result = ApiResponseDefinition.Result.FAILURE,
                FailureDescription = ApiResponseDefinition.Failure.UserRelatedFailure.EMAIL_EXIST
            };
        }
        
        var user = new AppUser {
            Email = request.Email,
            UserName = request.Email,
            AlternativeName = request.UserName
        };
        var role = new AppRole {
            Name = request.Role
        };

        var userStoreResult = IdentityResult.Success;
        if (ThirdPartyAuthDefinition.FromGoogle(request.Provider)) 
        {
            if (!await ValidateGoogleToken(request.Email, request.ProviderToken)) 
            {
                return new SignUpResponse {
                    Result = ApiResponseDefinition.Result.FAILURE,
                    FailureDescription = ApiResponseDefinition.Failure.UserRelatedFailure.INVALID_AUTH_TOKEN
                };
            }
            
            user.EmailConfirmed = true;
            userStoreResult = 
                String.IsNullOrEmpty(request.Password) ? 
                await _userManager.CreateAsync(user) : 
                await _userManager.CreateAsync(user, request.Password);
        } 
        else 
        {
            userStoreResult = await _userManager.CreateAsync(user, request.Password);
        }
        var userRoleRelationStoreResult = await _userManager.AddToRoleAsync(user, role.Name);
        if (userStoreResult.Succeeded && userRoleRelationStoreResult.Succeeded)
        {    
            if (ThirdPartyAuthDefinition.FromGoogle(request.Provider)) 
            {
                var thisUser = await _userManager.FindByEmailAsync(request.Email);
                var thisUserRole = await _userManager.GetRolesAsync(user);
                await _signInManager.SignInAsync(user, true);
                return new SignUpResponse {
                    Result = ApiResponseDefinition.Result.SUCCESS,
                    Id = thisUser.Id,
                    Email = thisUser.Email,
                    UserName = thisUser.AlternativeName,
                    Role = thisUserRole[0],
                    Provider = request.Provider
                };
            } 
            else 
            {
                var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                await _emailSender.SendEmailAsync(request.Email, "Please confirm your email", $"Your confirm code is {code}");
                return new SignUpResponse {
                    Result = ApiResponseDefinition.Result.SUCCESS
                };
            }
        }

        return new SignUpResponse {
            Result = ApiResponseDefinition.Result.FAILURE,
            FailureDescription = ApiResponseDefinition.Failure.UserRelatedFailure.SIGNUP_FAIL
        };
    }

    [HttpPost("signup-confirm")]
    public async Task<ActionResult<SignUpConfirmResponse>> SignUpConfirm([FromBody] SignUpConfirmRequest request) 
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            return new SignUpConfirmResponse {
                Result = ApiResponseDefinition.Result.FAILURE,
                FailureDescription = ApiResponseDefinition.Failure.UserRelatedFailure.USER_NOT_EXIST
            };
        }
        var result = await _userManager.ConfirmEmailAsync(user, request.Code);
        return new SignUpConfirmResponse {
            Result = result.Succeeded ? ApiResponseDefinition.Result.SUCCESS : ApiResponseDefinition.Result.FAILURE,
            FailureDescription = result.Succeeded ? null : ApiResponseDefinition.Failure.UserRelatedFailure.CONFIRM_EMAIL_FAIL
        };
    }

    [HttpPost("signout")]
    public async Task<ActionResult<SignOutResponse>> SignOutAsync() 
    {
        await _signInManager.SignOutAsync();
        return new SignOutResponse {
            Result = ApiResponseDefinition.Result.SUCCESS
        };
    }

    [HttpPost("edit")]
    public async Task<ActionResult<EditUserResponse>> EditUser([FromBody] EditUserRequest request) 
    {
        AppUser user = await _userManager.FindByIdAsync(request.Id);
        if (user == null) 
        {
            return new EditUserResponse() {
                Result = ApiResponseDefinition.Result.FAILURE,
                FailureDescription = ApiResponseDefinition.Failure.UserRelatedFailure.USER_NOT_EXIST
            };
        }
        if (!String.IsNullOrEmpty(request.NewPassword) && !String.IsNullOrEmpty(request.OldPassword)) 
        {
            var changePasswordResult = await _userManager.ChangePasswordAsync(user, request.OldPassword, request.NewPassword);
            return new EditUserResponse {
                Result = changePasswordResult.Succeeded ? ApiResponseDefinition.Result.SUCCESS : ApiResponseDefinition.Result.FAILURE,
                FailureDescription = changePasswordResult.Succeeded ? null : ApiResponseDefinition.Failure.UserRelatedFailure.CHANGE_PASSWORD_FAIL
            };
        }
        if (!String.IsNullOrEmpty(request.Username)) {
            var changeUsernameResult = await _userManager.UpdateAsync(user);
            return new EditUserResponse {
                Result = changeUsernameResult.Succeeded ? ApiResponseDefinition.Result.SUCCESS : ApiResponseDefinition.Result.FAILURE,
                FailureDescription = changeUsernameResult.Succeeded ? null : ApiResponseDefinition.Failure.UserRelatedFailure.CHANGE_USERNAME_FAIL
            };
        };
      
        return new EditUserResponse {
            Result = ApiResponseDefinition.Result.FAILURE,
            FailureDescription = ApiResponseDefinition.Failure.UserRelatedFailure.INVALID_USER_INFO_FOR_UPDATE
        };
    }

    [HttpPost("send-password-reset-email")]
    public async Task<ActionResult<SendPasswordResetEmailResponse>> SendPasswordResetEmail([FromQuery] string email) 
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            return new SendPasswordResetEmailResponse() {
                Result = ApiResponseDefinition.Result.FAILURE,
                FailureDescription = ApiResponseDefinition.Failure.UserRelatedFailure.USER_NOT_EXIST
            };
        }
        var code = await _userManager.GeneratePasswordResetTokenAsync(user);
        await _emailSender.SendEmailAsync(email, "Please reset your password with reset code", $"Your reset code is {code}");
        
        return new SendPasswordResetEmailResponse {
            Result = ApiResponseDefinition.Result.SUCCESS
        };
    }

    [HttpPost("password-reset")]
    public async Task<ActionResult<ResetPasswordResponse>> ResetPassword([FromBody] ResetPasswordRequest request) 
    {
        AppUser user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null) 
        {
            return new ResetPasswordResponse() {
                Result = ApiResponseDefinition.Result.FAILURE,
                FailureDescription = ApiResponseDefinition.Failure.UserRelatedFailure.USER_NOT_EXIST
            };
        }     
        var result = await _userManager.ResetPasswordAsync(user, request.Code, request.NewPassword);

        return new ResetPasswordResponse() {
            Result = result.Succeeded ? ApiResponseDefinition.Result.SUCCESS : ApiResponseDefinition.Result.FAILURE,
            FailureDescription = result.Succeeded ? null : ApiResponseDefinition.Failure.UserRelatedFailure.PASSWORD_RESET_FAIL
        };
    }

    [HttpGet("roles")]
    public async Task<GetRolesResponse> GetRoles() {
        var roles = await _roleManager.Roles.ToListAsync();
        return new GetRolesResponse {
            Result = ApiResponseDefinition.Result.SUCCESS,
            Roles = roles.Select(x => x.Name).ToList()
        };
    }

    public async Task<Boolean> ValidateGoogleToken(string email, string token) {
        var client = new HttpClient(); 
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var response = await client.GetAsync("https://www.googleapis.com/oauth2/v3/userinfo");
        if (!response.IsSuccessStatusCode)
        {
            return false;
        }
        var jsonResponse = JObject.Parse(await response.Content.ReadAsStringAsync());
        if (jsonResponse.GetValue("email") == null || !email.Equals(jsonResponse.GetValue("email").ToString())) 
        {
            return false;
        } 
        return true;
    }

}