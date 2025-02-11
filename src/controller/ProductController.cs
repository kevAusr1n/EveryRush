using EveryRush.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EveryRush.Controller;

[AllowAnonymous]
[Route("api/products")]
[ApiController]
public class ProductController : ControllerBase 
{   
    private readonly ProductService _productService;

    public ProductController(ProductService productService) {
        _productService = productService;
    }

    [HttpGet]
    public async Task<ActionResult<GetPaginatedMarketResponse>> GetPaginatedMarket(
        [FromQuery] int page,
        [FromQuery] int size,
        [FromQuery] string keyword = "",
        [FromQuery] string orderby = "",
        [FromQuery] string order = "") 
    {
        return await _productService.GetPaginatedMarket(page, size, keyword, orderby, order);
    }

    [HttpPost("create")]
    public async Task<ActionResult<Product>> CreateProduct(
        [FromBody] CreateProductRequest request) 
    {
        return await _productService.CreateProduct(request);
    }

    [HttpDelete("delete/{id}")]
    public async Task<ActionResult<Boolean>> DeleteProduct([FromRoute] string id) 
    {
        return await _productService.DeleteProduct(id);
    }
}