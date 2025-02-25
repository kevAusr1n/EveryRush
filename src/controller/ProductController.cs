using System.Security.Claims;
using EveryRush.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EveryRush.Controller;

[Route("api/products")]
[ApiController]
public class ProductController : ControllerBase 
{   
    private readonly ProductService _productService;

    public ProductController(ProductService productService) {
        _productService = productService;
    }

    [HttpGet]
    public async Task<ActionResult<GetPaginatedProductsResponse>> GetPaginatedProducts(
        [FromQuery] int page,
        [FromQuery] int size,
        [FromQuery] string keyword = "",
        [FromQuery] string orderby = "",
        [FromQuery] string order = "",
        [FromQuery] int minimumPrice = 0,
        [FromQuery] int maxmiumPrice = 999999) 
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var role = User.FindFirstValue(ClaimTypes.Role);
        return await _productService.GetPaginatedProducts(
            page, size, keyword, orderby, order, minimumPrice, maxmiumPrice, userId, role
        );
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct([FromRoute] string id) 
    {
        return await _productService.GetProduct(id);
    }

    [HttpPost("add")]
    [Authorize(Roles = "BusinessOwner")]
    public async Task<ActionResult<Product>> AddProduct([FromForm] AddOrUpdateProductRequest request) 
    {
        return await _productService.AddProduct(request);
    }

    [HttpPost("status-update/{id}")]
    [Authorize(Roles = "BusinessOwner")]
    public async Task<ActionResult<Boolean>> UpdateProductStatus([FromRoute] string id, [FromQuery] int newStatus)
    {
        return await _productService.UpdateProductStatus(id, newStatus);
    }

    [HttpDelete("delete/{id}")]
    [Authorize(Roles = "BusinessOwner")]
    public async Task<ActionResult<Boolean>> DeleteProduct([FromRoute] string id) 
    {
        return await _productService.DeleteProduct(id);
    }
}