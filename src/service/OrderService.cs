using EveryRush.Entity;
using Google.Apis.Drive.v3.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public class OrderService
{   
    private readonly AppDbContext _appDbContext;
    private readonly UserManager<AppUser> _userManager;
    private readonly IAuthorizationService _authorizationService;

    public OrderService(
        AppDbContext appDbContext,
        UserManager<AppUser> userManager,
        IAuthorizationService authorizationService) 
    {
        _appDbContext = appDbContext;
        _userManager = userManager;
        _authorizationService = authorizationService;
    }

    public async Task<GetPaginatedOrdersResponse> GetPaginatedOrders(
        string userId,
        int page,
        int size) 
    {       
        return null;
    }

    public async Task<Order> MakeOrder(MakeOrderRequest request) 
    {   
        AppUser user = await _userManager.FindByIdAsync(request.UserId);

        if (user == null) 
        {
            throw new Exception("User not found");
        }
        
        return null;
    }
}