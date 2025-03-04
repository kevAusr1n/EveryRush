using EveryRush.Entity;
using EveryRush.Request;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace EveryRush.Controller;

[Route("api/cart")]
[ApiController]
public class CartController : ControllerBase 
{
    private readonly AppDbContext _appDbContext;

    public CartController(AppDbContext appDbContext) 
    {
        _appDbContext = appDbContext;
    }

    [HttpGet]
    [Authorize(Roles = "Customer")]
    public async Task<ActionResult<GetCartResponse>> GetCart([FromQuery] string userId) 
    {
        var cartItems = 
            from cartItem in _appDbContext.CartItems
            where cartItem.AppUserId == userId
            select cartItem;

        if (cartItems.Count() == 0)
        {
            return new GetCartResponse {
                CartItems = new List<CartItemResponse>()
            };
        }

        var products = 
            from product in _appDbContext.Products  
            where cartItems.Select(c => c.ProductId).Contains(product.Id)
            select product;
        
        IList<CartItemResponse> cartItemResponses = new List<CartItemResponse>();
    
        foreach (CartItem cartItem in cartItems.ToList()) 
        {
            var sellerId = products.Where(p => p.Id == cartItem.ProductId).FirstOrDefault()?.AppUserId;
            var selllerName = _appDbContext.AppUsers.Where(u => u.Id == sellerId).FirstOrDefault()?.AlternativeName;

            var cartItemResponse = new CartItemResponse {
                Id = cartItem.Id,
                SellerId = sellerId,
                SellerName = selllerName,
                ProductId = cartItem.ProductId,
                Quantity = cartItem.Quantity,
                Name = products.Where(p => p.Id == cartItem.ProductId).FirstOrDefault()?.Name,
                Description = products.Where(p => p.Id == cartItem.ProductId).FirstOrDefault()?.Description,
                Price = products.Where(p => p.Id == cartItem.ProductId).FirstOrDefault()?.Price,
                ImageUrl = products.Where(p => p.Id == cartItem.ProductId).FirstOrDefault()?.ImageUrl,
                Status = products.Where(p => p.Id == cartItem.ProductId).FirstOrDefault()?.Status
            };
            cartItemResponses.Add(cartItemResponse);
        }
        
        cartItemResponses = cartItemResponses.OrderBy(c => c.SellerId).ToList();

        return new GetCartResponse {
            CartItems = cartItemResponses
        };
    }

    [HttpPost("add")]
    [Authorize(Roles = "Customer")]
    public async Task<ActionResult<AddCartItemResponse>> AddCartItem([FromBody] AddCartItemRequest request) 
    {
        var existeCartItem = _appDbContext.CartItems.Where(c => c.AppUserId == request.UserId && c.ProductId == request.ProductId).FirstOrDefault();
        if (existeCartItem != null) 
        {
            existeCartItem.Quantity += request.Quantity;
            _appDbContext.CartItems.Update(existeCartItem);
            await _appDbContext.SaveChangesAsync();

            return new AddCartItemResponse {
                Result = ApiResponseDefinition.Result.SUCCESS
            };
        }
        
        CartItem newCartItem = new CartItem {
            Id = Guid.NewGuid().ToString(),
            AppUserId = request.UserId,
            ProductId = request.ProductId,
            Quantity = request.Quantity
        };
        _appDbContext.CartItems.Add(newCartItem);
        await _appDbContext.SaveChangesAsync();

        return new AddCartItemResponse {
            Result = ApiResponseDefinition.Result.SUCCESS
        };
    }

    [HttpPost("update")]
    [Authorize(Roles = "Customer")]
    public async Task<ActionResult<Boolean>> UpdateCartItem([FromBody] UpdateCartItemRequest request) 
    {
        CartItem cartItem = _appDbContext.CartItems.Where(c => c.Id == request.Id).FirstOrDefault();
        if (cartItem == null) 
        {
            return true;
        }
        cartItem.Quantity = request.Quantity;
        _appDbContext.CartItems.Update(cartItem);
        await _appDbContext.SaveChangesAsync();

        return true;
    }

    [HttpDelete("delete/{id}")]
    [Authorize(Roles = "Customer")]
    public async Task<ActionResult<Boolean>> DeleteCartItem([FromRoute] string id) 
    {
        CartItem cartItem = _appDbContext.CartItems.Where(c => c.Id == id).FirstOrDefault();
        if (cartItem == null) 
        {
            return true;
        }
        _appDbContext.CartItems.Remove(cartItem); 
        await _appDbContext.SaveChangesAsync();

        return true;
    }
}