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
    private readonly CartService _cartService;

    public CartController(CartService cartService) 
    {
        _cartService = cartService;
    }

    [HttpGet]
    //[Authorize(Roles = "Customer", AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<ActionResult<GetCartResponse>> GetCart([FromQuery] string userId) 
    {
        return await _cartService.GetCart(userId);
    }

    [HttpPost("add")]
    public async Task<ActionResult<Boolean>> AddCartItem([FromBody] AddCartItemRequest request) 
    {
        return await _cartService.AddCartItem(request);
    }

    [HttpPost("update")]
    public async Task<ActionResult<Boolean>> UpdateCartItem([FromBody] UpdateCartItemRequest request) 
    {
        return await _cartService.UpdateCartItem(request);
    }

    [HttpDelete("delete/{id}")]
    public async Task<ActionResult<Boolean>> DeleteCartItem([FromRoute] string id) 
    {
        return await _cartService.DeleteCartItem(id);
    }
}