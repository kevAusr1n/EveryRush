using EveryRush.Request;
using EveryRush.Entity;
using Microsoft.AspNetCore.Identity;
using Google.Apis.Auth;
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.Auth.OAuth2.Requests;
using System.Security.Cryptography.X509Certificates;

public class AuthService 
{
    private readonly UserManager<AppUser> _userManager;
    private readonly RoleManager<AppRole> _roleManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly AuthDbContext _authDbContext;

    public AuthService(
        UserManager<AppUser> userManager,
        RoleManager<AppRole> roleManager, 
        SignInManager<AppUser> signInManager,
        AuthDbContext authDbContext) 
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _signInManager = signInManager;
        _authDbContext = authDbContext;
    }

    public async Task<AppUser> ThirdPartyLoginUserExistCheckAsync(string email) 
    {   
        AppUser user = await _userManager.FindByEmailAsync(email);
        if (user == null) {
            user = new AppUser {
                Email = "none"
            };
        }
        return user;
    }

    public async Task<AppUser> LoginAsync(LoginRequest request) 
    {
        AppUser user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null) 
        {
            return new AppUser {
                Email = "none"
            };
        }

        await _signInManager.SignInAsync(user, false);
        return user;
    }

    public async Task<AppUser> RegisterAsync(RegisterRequest request) 
    {           
        var appUser = new AppUser {
            Email = request.Email,
            UserName = request.UserName
        };

        var appRole = new AppRole {
            Name = request.Role
        };

        var roleStoreResult = await _roleManager.CreateAsync(appRole);
        var userStoreResult = await _userManager.CreateAsync(appUser, request.Password);
        var userRoleRelationStoreResult = await _userManager.AddToRoleAsync(appUser, appRole.Name);

        if (userStoreResult.Succeeded && roleStoreResult.Succeeded && userRoleRelationStoreResult.Succeeded) {
            return appUser;
        }

        return new AppUser();
    }
}