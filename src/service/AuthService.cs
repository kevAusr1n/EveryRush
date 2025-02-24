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

public class AuthService 
{
    private readonly UserManager<AppUser> _userManager;
    private readonly RoleManager<AppRole> _roleManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly AppDbContext _appDbContext;

    public AuthService(
        UserManager<AppUser> userManager,
        RoleManager<AppRole> roleManager, 
        SignInManager<AppUser> signInManager,
        AppDbContext appDbContext) 
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _signInManager = signInManager;
        _appDbContext = appDbContext;
    }

    public async Task<AppUser> ThirdPartySignInUserExistCheckAsync(string email) 
    {   
        AppUser user = await _userManager.FindByEmailAsync(email);
        if (user == null) {
            user = new AppUser {
                Email = "none"
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

    public async Task<GetUserResponse> SignUpAsync(SignUpRequest request) 
    {           
        var user = new AppUser {
            Email = request.Email,
            UserName = request.Email,
            AlternativeName = request.UserName
        };
        var role = new AppRole {
            Name = request.Role
        };
        if (_roleManager.GetRoleNameAsync(role).Result != request.Role) 
        {
            var roleStoreResult = await _roleManager.CreateAsync(role);
            if (!roleStoreResult.Succeeded) {
                return new GetUserResponse();
            }
        }
        var userStoreResult = await _userManager.CreateAsync(user, request.Password);
        var userRoleRelationStoreResult = await _userManager.AddToRoleAsync(user, role.Name);
        if (userStoreResult.Succeeded && userRoleRelationStoreResult.Succeeded)
        {    
            if (request.doSignInAfterSignUp) {
                return await SignInAsync(new SignInRequest() {
                    Email = request.Email,
                    Password = request.Password
                });
            }
        }

        return new GetUserResponse();
    }

    public async Task<Boolean> EditUserAsync(EditUserRequest request) 
    {
        // TODO: implement
        AppUser user = await _userManager.FindByIdAsync(request.Id);
        if (user == null) {
            return false;
        }
        if (!String.IsNullOrEmpty(request.NewPassword) && !String.IsNullOrEmpty(request.OldPassword)) 
        {
            var result = await _userManager.ChangePasswordAsync(user, request.OldPassword, request.NewPassword);
            return result.Succeeded;
        }
        user.AlternativeName = request.Username;
        await _userManager.UpdateAsync(user);

        return true;
    }
}