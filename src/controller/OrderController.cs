using EveryRush.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EveryRush.Controller;

[AllowAnonymous]
[Route("api/orders")]
[ApiController]
public class OrderController : ControllerBase 
{   
    private readonly OrderService _orderService;

    public OrderController(OrderService orderService) {
        _orderService = orderService;
    }

    [HttpGet]
    public async Task<ActionResult<GetPaginatedOrdersResponse>> GetPaginatedOrders(
        [FromQuery] string userId,
        [FromQuery] int page,
        [FromQuery] int size) 
    {
        return await _orderService.GetPaginatedOrders(userId, page, size);
    }

    [HttpPost("make")]
    public async Task<ActionResult<Order>> Makeorder([FromBody] MakeOrderRequest request) 
    {
        return await _orderService.MakeOrder(request);
    }
}