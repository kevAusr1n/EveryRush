using System.Collections.ObjectModel;
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
    private readonly FileService _fileService;
    private readonly AppDbContext _appDbContext;

    public ProductController(AppDbContext appDbContext, FileService fileService) {
        _appDbContext = appDbContext;
        _fileService = fileService;
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
            where product.Status != ProductDefinition.Status.DELETED
            select product;

        if (UserDefinition.Role.BUSINESS_OWNER.Equals(role)) 
        {
            productsQuery = 
                from product in productsQuery 
                where product.AppUserId.Equals(userId)
                select product;
        } else 
        {
            productsQuery = 
                from product in productsQuery 
                where product.Status != ProductDefinition.Status.OFF_SHELF
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
        if (UserDefinition.Role.BUSINESS_OWNER.Equals(role)) 
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
        var product = await _appDbContext.Products.Where(p => p.Id == id).FirstOrDefaultAsync();
        var appUser = await _appDbContext.AppUsers.Where(u => u.Id == product.AppUserId).FirstOrDefaultAsync();

        return new ProductView{
            Id = product.Id,
            UserId = product.AppUserId,
            UserName = appUser.AlternativeName,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            Stock = product.Stock,
            Status = product.Status,
            ImageUrl = product.ImageUrl
        };
    }

    [HttpPost("add")]
    [Authorize(Roles = "BusinessOwner")]
    public async Task<ActionResult<AddProductResponse>> AddProduct([FromForm] AddOrUpdateProductRequest request) 
    {
        var newProduct = new Product
        {
            Id = Guid.NewGuid().ToString(),
            AppUserId = request.UserId,
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            Stock = request.Stock,
            Status = request.Stock > 0 ? ProductDefinition.Status.IN_SALE : ProductDefinition.Status.OUT_OF_STOCK
        };

        if (request.Files == null || request.Files.Count == 0)
        {
            return new AddProductResponse {
                Result = ApiResponseDefinition.Result.FAILURE,
                FailureDescription = ApiResponseDefinition.Failure.ProductRelatedFailure.NO_IMAGE_PROVIDED
            };
        } 

        IList<string> toSaveFilesPaths = new List<string>();
        toSaveFilesPaths = await _fileService.SaveFilesWithDb(request.Files, newProduct.Id);
             
        newProduct.ImageUrl = String.Join(",", toSaveFilesPaths);
        _appDbContext.Products.Add(newProduct);
        await _appDbContext.SaveChangesAsync();

        return new AddProductResponse {
            Result = ApiResponseDefinition.Result.SUCCESS
        };
    }

    [HttpPost("update")]
    [Authorize(Roles = "BusinessOwner")]
    public async Task<ActionResult<UpdateProductResponse>> UpdateProduct([FromForm] AddOrUpdateProductRequest request) 
    {
        var product = _appDbContext.Products.FirstOrDefault(p => p.Id == request.Id);
        if (product == null) 
        {
            return new UpdateProductResponse {
                Result = ApiResponseDefinition.Result.FAILURE,
                FailureDescription = ApiResponseDefinition.Failure.ProductRelatedFailure.PRODUCT_NOT_EXIST
            };
        }

        if (String.IsNullOrEmpty(request.ToKeepImageUrl) && (request.Files == null || request.Files.Count == 0)) 
        {
            return new UpdateProductResponse {
                Result = ApiResponseDefinition.Result.FAILURE,
                FailureDescription = ApiResponseDefinition.Failure.ProductRelatedFailure.NO_IMAGE_PROVIDED
            };
        }

        product.Name = request.Name;
        product.Description = request.Description;
        product.Price = request.Price;
        product.Stock = request.Stock;
        
        if (product.Stock == 0 && product.Status == ProductDefinition.Status.IN_SALE) {
            product.Status = ProductDefinition.Status.OUT_OF_STOCK;
        }
        if (product.Stock > 0 && product.Status == ProductDefinition.Status.OUT_OF_STOCK) {
            product.Status = ProductDefinition.Status.IN_SALE;
        }

        // save new images if there is
        IList<string> toSaveFilesPaths = new List<string>();
        if (request.Files != null && request.Files.Count > 0) 
        {
            toSaveFilesPaths = await _fileService.SaveFilesWithDb(request.Files, request.Id);
        }

        IList<string> toKeepFilePaths = 
            String.IsNullOrEmpty(request.ToKeepImageUrl) ? 
            new List<string>() : 
            request.ToKeepImageUrl.Split(",").ToList();
        IList<string> allOldFilesPaths = product.ImageUrl.Split(",").ToList();

        // delete old images if there is
        // if this product has been purchased ever, then related images cannot be deleted
        if (!_appDbContext.PurchaseProducts.Where(p => p.ProductId == request.Id).Any()) 
        {
            await _fileService.DeleteFiles(allOldFilesPaths.Except(toKeepFilePaths).ToList());
        }

        product.ImageUrl = 
            toKeepFilePaths.Count > 0 ? 
            String.Join(",", toKeepFilePaths) :
            "";

        if (toSaveFilesPaths.Count > 0) 
        {
            product.ImageUrl = 
                String.IsNullOrEmpty(product.ImageUrl) ? 
                String.Join(",", toSaveFilesPaths) :
                product.ImageUrl + "," + String.Join(",", toSaveFilesPaths);
        }
        _appDbContext.Products.Update(product);
        await _appDbContext.SaveChangesAsync();

        return new UpdateProductResponse {
            Result = ApiResponseDefinition.Result.SUCCESS
        };
    }

    [HttpPost("status-update/{id}")]
    [Authorize(Roles = "BusinessOwner")]
    public async Task<ActionResult<UpdateProductResponse>> UpdateProductStatus([FromRoute] string id, [FromQuery] int newStatus)
    {
        var product = await _appDbContext.Products.FindAsync(id);
        if (product == null) 
        {
            return new UpdateProductResponse {
                Result = ApiResponseDefinition.Result.SUCCESS,
                FailureDescription = ApiResponseDefinition.Failure.ProductRelatedFailure.PRODUCT_NOT_EXIST
            };
        }
        if (newStatus == ProductDefinition.Status.IN_SALE) 
        {
            newStatus = product.Stock != 0 ? newStatus : ProductDefinition.Status.OUT_OF_STOCK;
        }
        product.Status = newStatus;
        _appDbContext.Products.Update(product);
        await _appDbContext.SaveChangesAsync();

        return new UpdateProductResponse {
            Result = ApiResponseDefinition.Result.SUCCESS
        };
    }

    [HttpDelete("delete/{id}")]
    [Authorize(Roles = "BusinessOwner")]
    public async Task<ActionResult<DeleteProductResponse>> DeleteProduct([FromRoute] string id) 
    {
        var product = await _appDbContext.Products.FindAsync(id);
        if (product == null) 
        {
            return new DeleteProductResponse {
                Result = ApiResponseDefinition.Result.SUCCESS,
                FailureDescription = ApiResponseDefinition.Failure.ProductRelatedFailure.PRODUCT_NOT_EXIST
            };
        }
        if (_appDbContext.PurchaseProducts.Where(o => o.ProductId == id).Count() > 0 ||
            _appDbContext.CartItems.Where(o => o.ProductId == id).Count() > 0) 
        {
            product.Status = ProductDefinition.Status.DELETED;
            _appDbContext.Products.Update(product);
            await _appDbContext.SaveChangesAsync();
            
            return new DeleteProductResponse {
                Result = ApiResponseDefinition.Result.SUCCESS,
            };
        }

        _appDbContext.AppFiles.RemoveRange(_appDbContext.AppFiles.Where(f => f.ProductId == id));
        _appDbContext.Products.Remove(product);
        await _appDbContext.SaveChangesAsync();

        return new DeleteProductResponse {
            Result = ApiResponseDefinition.Result.SUCCESS
        };
    }
}