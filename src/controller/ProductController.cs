using System.Security.Claims;
using EveryRush.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EveryRush.Controller;

[Route("api/products")]
[ApiController]
public class ProductController : ControllerBase 
{   
    private readonly ProductService _productService;

    private readonly AppDbContext _appDbContext;

    public ProductController(ProductService productService, AppDbContext appDbContext) {
        _productService = productService;
        _appDbContext = appDbContext;
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
        
        var productsQuery = 
            from product in _appDbContext.Products
            where product.Status != ProductStatus.DELETED
            select product;

        if (RoleConfig.BUSINESS_OWNER.Equals(role)) 
        {
            productsQuery = 
                from product in productsQuery 
                where product.AppUserId.Equals(userId)
                select product;
        } else 
        {
            productsQuery = 
                from product in productsQuery 
                where product.Status != ProductStatus.OFF_SHELF
                select product;
        }
        if (minimumPrice > 0) 
        {
            productsQuery = 
                from product in productsQuery 
                where product.Price >= minimumPrice
                select product;
        }
        if (maxmiumPrice > 0) 
        {
            productsQuery = 
                from product in productsQuery 
                where product.Price <= maxmiumPrice
                select product;
        }
        if (!String.IsNullOrEmpty(keyword)) 
        {
            productsQuery = 
                from product in productsQuery 
                where product.Name.Contains(keyword)
                select product;
        }
        if (!String.IsNullOrEmpty(orderby)) 
        {   
            switch (orderby + "/" + order) 
            {
                case "price/asc": 
                    productsQuery = 
                        from product in productsQuery 
                        orderby product.Price ascending
                        select product;
                    break;
                case "price/desc": 
                    productsQuery = 
                        from product in productsQuery 
                        orderby product.Price descending
                        select product;
                    break;
            }
        }
        if (RoleConfig.BUSINESS_OWNER.Equals(role)) 
        {
            productsQuery = 
                from product in productsQuery 
                orderby product.Status ascending
                select product;
        }

        var totalCount = await productsQuery.CountAsync();
        var totalPages = (int)Math.Ceiling((double)totalCount / size); 
        var response = new GetPaginatedProductsResponse {
            TotalCount = totalCount,
            TotalPages = totalPages,
            Products = await productsQuery
            .Skip((page - 1) * size)
            .Take(size)
            .ToListAsync()
        };
        foreach (Product product in response.Products) 
        {
            product.AppFiles = 
            (
                from image in _appDbContext.AppFiles
                where image.ProductId == product.Id
                select image
            )
            .ToList();
        }

        return response;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductView>> GetProductDetail([FromRoute] string id) 
    {
        return await _productService.GetProductDetail(id);
    }

    [HttpPost("add")]
    [Authorize(Roles = "BusinessOwner")]
    public async Task<ActionResult<Product>> AddProduct([FromForm] AddOrUpdateProductRequest request) 
    {
        return await _productService.AddProduct(request);
    }

    [HttpPost("updatexxxx")]
    [Authorize(Roles = "BusinessOwner")]
    public async Task<ActionResult<UpdateProductResponse>> UpdateProduct([FromForm] AddOrUpdateProductRequest request) 
    {
        var product = _appDbContext.Products.FirstOrDefault(p => p.Id == request.Id);
        if (product == null) 
        {
            return new UpdateProductResponse {
                Result = RequestResult.FAILURE
            };
        }
        product.Name = request.Name;
        product.Description = request.Description;
        product.Price = request.Price;
        product.Stock = request.Stock;
        
        if (product.Stock == 0 && product.Status == ProductStatus.IN_SALE) {
            product.Status = ProductStatus.OUT_OF_STOCK;
        }
        if (product.Stock > 0 && product.Status == ProductStatus.OUT_OF_STOCK) {
            product.Status = ProductStatus.IN_SALE;
        }

        List<AppFile> savedFiles = new List<AppFile>();
        if (request.Files != null && request.Files.Count > 0) 
        {
            foreach (IFormFile file in request.Files) 
            {
                using (var memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream);                               
                    var imageUrl = Path.Combine(StaticFileRootPath.GetImagePath(), 
                    request.UserId + "-" + Guid.NewGuid().ToString() + "-" + DateTime.Now.ToString("yyyyMMddHHmmss") + "-image." + file.ContentType.Split("/")[1]);
                    var storePath = Path.Combine(StaticFileRootPath.GetStaticFileRootPath(), imageUrl);
                    AppFile newFile = new AppFile {
                        Id = Guid.NewGuid().ToString(),
                        Url = imageUrl,
                        ProductId = request.Id,
                        Format = file.ContentType,
                    };
                    savedFiles.Add(newFile);
                    await file.CopyToAsync(new FileStream(storePath, FileMode.OpenOrCreate));
                }
            } 
        }

        if (!_appDbContext.PurchaseProducts.Where(p => p.ProductId == request.Id).Any()) 
        {
            string[] oldFiles = product.ImageUrl.Split(",").ToArray();
            string[] newFiles = product.ImageUrl.Split(",").ToArray(); 
        }

        _appDbContext.Products.Update(product);
        _appDbContext.AppFiles.AddRange(savedFiles);
        await _appDbContext.SaveChangesAsync();

        return new UpdateProductResponse {
            Result = RequestResult.FAILURE
        };
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