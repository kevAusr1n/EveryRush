using EveryRush.Request;
using EveryRush.Entity;
using Microsoft.AspNetCore.Identity;
using Google.Apis.Auth;
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.Auth.OAuth2.Requests;
using System.Security.Cryptography.X509Certificates;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Google.Apis.Drive.v3.Data;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;

public class AuthService 
{
    private readonly UserManager<AppUser> _userManager;
    private readonly RoleManager<AppRole> _roleManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly EmailSender _emailSender;

    public AuthService(
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

    public async Task<AppUser> ThirdPartySignInUserExistCheckAsync(string email) 
    {   
        AppUser user = await _userManager.FindByEmailAsync(email);
        if (user == null) {
            user = new AppUser {
                Email = UserConfig.USER_NOT_EXIST
            };
        }

        return user;
    }

    public async Task<GetUserResponse> SignInAsync(SignInRequest request) 
    {
        AppUser user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null) 
        {
            return new GetUserResponse();
        }

        if (ThirdPartySignInProviderConfig.FromThirdParty(request.Provider)) 
        {
            var role = await _userManager.GetRolesAsync(user);
            await _signInManager.SignInAsync(user, true);
            return new GetUserResponse {
                Id = user.Id,
                Email = user.Email,
                UserName = user.AlternativeName,
                Role = role[0]
            };
        }
        if (request.ConfirmRequired && !await _userManager.IsEmailConfirmedAsync(user)) {
            return new GetUserResponse {
                Result = RequestResult.FAILURE
            };
        }
        var result = await _signInManager.PasswordSignInAsync(request.Email, request.Password, true, false);
        if (result.Succeeded) 
        {   
            var role = await _userManager.GetRolesAsync(user);
            return new GetUserResponse {
                Id = user.Id,
                Email = user.Email,
                UserName = user.AlternativeName,
                Role = role[0]
            };
        }

        return new GetUserResponse();
    }

    public async Task<SignUpResponse> SignUpAsync(SignUpRequest request) 
    {           
        if (await _userManager.FindByEmailAsync(request.Email) != null) {
            return new SignUpResponse {
                Result = RequestResult.FAILURE,
                Comment = "Email already exist"
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
        if (ThirdPartySignInProviderConfig.FromThirdParty(request.Provider)) {
            userStoreResult = 
                String.IsNullOrEmpty(request.Password) ? 
                await _userManager.CreateAsync(user) : 
                await _userManager.CreateAsync(user, request.Password);
        } else 
        {
            userStoreResult = await _userManager.CreateAsync(user, request.Password);
        }
        var userRoleRelationStoreResult = await _userManager.AddToRoleAsync(user, role.Name);
        if (userStoreResult.Succeeded && userRoleRelationStoreResult.Succeeded)
        {    
            if (request.doSignInAfterSignUp && ThirdPartySignInProviderConfig.FromThirdParty(request.Provider)) {
                GetUserResponse getUserResponse = await SignInAsync(new SignInRequest() {
                    Email = request.Email,
                    Password = request.Password,
                    Provider = request.Provider
                });
                return new SignUpResponse {
                    Result = RequestResult.SUCCESS,
                    Id = getUserResponse.Id,
                    Email = request.Email,
                    UserName = getUserResponse.UserName,
                    Role = getUserResponse.Role,
                    Jwt = getUserResponse.Jwt,
                    Provider = request.Provider
                };
            } else {
                var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                _emailSender.SendEmailAsync(request.Email, "Please confirm your email", $"Your confirm code is {code}");
            }
        }

        return new SignUpResponse {
            Result = RequestResult.SUCCESS
        };
    }

    public async Task<SignUpConfirmResponse> SignUpConfirmAsync(SignUpConfirmRequest request) {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            return new SignUpConfirmResponse {
                Result = RequestResult.FAILURE
            };
        }
        var result = await _userManager.ConfirmEmailAsync(user, request.Code);
        return new SignUpConfirmResponse {
            Result = result.Succeeded ? RequestResult.SUCCESS : RequestResult.FAILURE
        };
    }

    public async Task<Boolean> SignOutAsync() {
        await _signInManager.SignOutAsync();
        return true;
    } 

    public async Task<EditUserInfoResponse> EditUserAsync(EditUserRequest request) 
    {
        // TODO: implement
        AppUser user = await _userManager.FindByIdAsync(request.Id);
        if (user == null) 
        {
            return new EditUserInfoResponse {
                Result = RequestResult.FAILURE
            };
        }
        if (!String.IsNullOrEmpty(request.NewPassword) && !String.IsNullOrEmpty(request.OldPassword)) 
        {
            Console.WriteLine($"old pwd: {request.OldPassword}, new pwd: {request.NewPassword}");
            var changePasswordResult = await _userManager.ChangePasswordAsync(user, request.OldPassword, request.NewPassword);
            return new EditUserInfoResponse {
                Result = changePasswordResult.Succeeded ? RequestResult.SUCCESS : RequestResult.FAILURE
            };
        }
        user.AlternativeName = request.Username;
        var changeUsernameResult = await _userManager.UpdateAsync(user);

        return new EditUserInfoResponse {
            Result = changeUsernameResult.Succeeded ? RequestResult.SUCCESS : RequestResult.FAILURE
        };
    }

    public async Task<SendPasswordResetEmailResponse> SendPasswordResetEmailAsync(string email) {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            return new SendPasswordResetEmailResponse {
                Result = RequestResult.FAILURE
            };
        }
        var code = await _userManager.GeneratePasswordResetTokenAsync(user);
        await _emailSender.SendEmailAsync(email, "Please reset your password with reset code", $"Your reset code is {code}");
        
        return new SendPasswordResetEmailResponse {
            Result = RequestResult.SUCCESS
        };
    } 

    public async Task<ResetPasswordResponse> ResetPasswordAsync(ResetPasswordRequest request) {
        AppUser user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null) 
        {
            return new ResetPasswordResponse() {
                Result = RequestResult.FAILURE
            };
        }     
        var result = await _userManager.ResetPasswordAsync(user, request.Code, request.NewPassword);
        return new ResetPasswordResponse() {
            Result = result.Succeeded ? RequestResult.SUCCESS : RequestResult.FAILURE
        };
    } 
}