using EveryRush.Entity;
using Google.Apis.Drive.v3.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public class ProductService 
{   
    private readonly AuthDbContext _authDbContext;
    private readonly ProductDbContext _productDbContext;
    private readonly IAuthorizationService _authorizationService;

    public ProductService(
        AuthDbContext authDbContext,
        ProductDbContext productDbContext, 
        IAuthorizationService authorizationService) 
    {
        _authDbContext = authDbContext;
        _productDbContext = productDbContext;
        _authorizationService = authorizationService;
    }

    public async Task<GetPaginatedMarketResponse> GetPaginatedMarket(
        int page, 
        int size,
        string keyword,
        string orderby,
        string order) 
    {       
        var totalCount = await _productDbContext.Products.CountAsync();
        var totalPages = (int)Math.Ceiling((double)totalCount / size);
        IQueryable<Product> productsQuery = _productDbContext.Products.Where(p => 1 == 1);

        if (!String.IsNullOrEmpty(keyword)) 
        {
            productsQuery = productsQuery.Where(p => p.Name.Contains(keyword));
        }
        if (!String.IsNullOrEmpty(orderby)) 
        {   
            switch (orderby + "/" + order) 
            {
                case "price/asc": 
                    productsQuery = productsQuery.OrderBy(p => p.Price);
                    break;
                case "price/desc": 
                    productsQuery = productsQuery.OrderByDescending(p => p.Price);
                    break;
            }
        } 

        return new GetPaginatedMarketResponse 
        {
            TotalCount = totalCount,
            TotalPages = totalPages,
            Products = await productsQuery
            .Skip((page - 1) * size)
            .Take(size)
            .ToListAsync()
        };
    }

    public async Task<Product> CreateProduct(CreateProductRequest request) 
    {   
        var newProduct = new Product
        {
            Id = Guid.NewGuid().ToString(),
            OwnerId = request.OwnerId,
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            Stock = request.Stock
        };
        
        try 
        {
            _productDbContext.Products.Add(newProduct);
            await _productDbContext.SaveChangesAsync();
            return newProduct;
        }
        catch (DbUpdateException e) 
        {
            return null;
        } 
    }

    public async Task<Boolean> DeleteProduct(string id) 
    {   
        try 
        {   
            var product = await _productDbContext.Products.FindAsync(id);

            if (product == null) {
                return true;
            }

            _productDbContext.Products.Remove(product);
            await _productDbContext.SaveChangesAsync();
            return true;
        }
        catch (DbUpdateException e) 
        { 
            return false;
        } 
    }
}