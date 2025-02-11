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

    public async Task<GetUserResponse> LoginAsync(LoginRequest request) 
    {
        AppUser user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null) 
        {
            return new GetUserResponse {
                Email = "none"
            };
        }

        IList<string> roles = await _userManager.GetRolesAsync(user);
        await _signInManager.SignInAsync(user, false);

        return new GetUserResponse {
            Id = user.Id,
            Email = user.Email,
            UserName = user.UserName,
            Role = roles[0]
        };
    }

    public async Task<GetUserResponse> RegisterAsync(RegisterRequest request) 
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

        if (userStoreResult.Succeeded && roleStoreResult.Succeeded && userRoleRelationStoreResult.Succeeded)
        {    
            AppUser user = await _userManager.FindByEmailAsync(request.Email);

            return new GetUserResponse() {
                Id = user.Id,
                Email = request.Email,
                UserName = request.UserName,
                Role = request.Role
            };
        }

        return new GetUserResponse() {
            Email = "none"
        };
    }
}