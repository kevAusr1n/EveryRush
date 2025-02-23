using EveryRush.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EveryRush.Controller;

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
    [Authorize(Roles = "Customer")]
    public async Task<ActionResult<Order>> MakeOrder([FromBody] MakeOrderRequest request) 
    {
        return await _orderService.MakeOrder(request);
    }

    [HttpPost("accept")]
    [Authorize(Roles = "BusinessOwner")]
    public async Task<ActionResult<Order>> AcceptOrder([FromBody] MakeOrderRequest request) 
    {
        return await _orderService.MakeOrder(request);
    }

    [HttpPost("cancel-initiative")]
    [Authorize(Roles = "Customer")]
    public async Task<ActionResult<Order>> RequestCancelOrder([FromBody] MakeOrderRequest request) 
    {
        return await _orderService.MakeOrder(request);
    }
}