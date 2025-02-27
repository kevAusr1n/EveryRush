using System.Collections;
using EveryRush.Entity;
using Google.Apis.Drive.v3.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public class CartService 
{   
    private readonly AppDbContext _appDbContext;

    public CartService(AppDbContext appDbContext) 
    {
        _appDbContext = appDbContext;
    }

    public async Task<GetCartResponse> GetCart(string userId) 
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

    public async Task<Boolean> AddCartItem(AddCartItemRequest request) 
    {
        var existeCartItem = _appDbContext.CartItems.Where(c => c.AppUserId == request.UserId && c.ProductId == request.ProductId).FirstOrDefault();
        if (existeCartItem != null) 
        {
            existeCartItem.Quantity += request.Quantity;
            _appDbContext.CartItems.Update(existeCartItem);
            await _appDbContext.SaveChangesAsync();

            return true;
        }
        
        CartItem newCartItem = new CartItem {
            Id = Guid.NewGuid().ToString(),
            AppUserId = request.UserId,
            ProductId = request.ProductId,
            Quantity = request.Quantity
        };
        _appDbContext.CartItems.Add(newCartItem);
        await _appDbContext.SaveChangesAsync();

        return true;
    }

    public async Task<Boolean> UpdateCartItem(UpdateCartItemRequest request) 
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

    public async Task<Boolean> DeleteCartItem(string id) 
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