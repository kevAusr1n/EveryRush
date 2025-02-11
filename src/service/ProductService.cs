using System.Collections;
using EveryRush.Entity;
using Google.Apis.Drive.v3.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public class ProductService 
{   
    private readonly AppDbContext _appDbContext;
    private readonly IAuthorizationService _authorizationService;

    public ProductService(
        AppDbContext appDbContext,
        IAuthorizationService authorizationService) 
    {
        _appDbContext = appDbContext;
        _authorizationService = authorizationService;
    }

    public async Task<GetPaginatedMarketResponse> GetPaginatedMarket(
        int page, 
        int size,
        string keyword,
        string orderby,
        string order) 
    {       
        var totalCount = await _appDbContext.Products.CountAsync();
        var totalPages = (int)Math.Ceiling((double)totalCount / size);
        IQueryable<Product> productsQuery = _appDbContext.Products.Where(p => 1 == 1);

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

    public async Task<Product> AddProduct(AddProductRequest request) 
    {   
        var newProduct = new Product
        {
            Id = Guid.NewGuid().ToString(),
            AppUserId = request.UserId,
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            Stock = request.Stock
        };
        
        var ImageUrl = "";

        foreach (IFormFile file in request.Files) 
        {
            var thisUrl = request.UserId + "-" + DateTime.Now.ToString("yyyyMMddHHmmss") 
                + "-" + file.ContentType;

            using (var memoryStream = new MemoryStream())
            {
                await file.CopyToAsync(memoryStream);
                
                byte[] header = new byte[4];
                memoryStream.Read(header, 0, header.Length);
                string format = BitConverter.ToString(header);

                AppFile newFile = new AppFile {
                    Id = Guid.NewGuid().ToString(),
                    Name = thisUrl,
                    ProductId = newProduct.Id,
                    Content = memoryStream.ToArray(),
                    Format = format,
                };

                _appDbContext.AppFiles.Add(newFile);
                await _appDbContext.SaveChangesAsync();
            }
        } 

        newProduct.ImageUrl = ImageUrl;

        try 
        {
            _appDbContext.Products.Add(newProduct);
            await _appDbContext.SaveChangesAsync();
            return newProduct;
        }

        catch (DbUpdateException e) 
        {
            return new Product();
        } 
    }

    public async Task<Boolean> DeleteProduct(string id) 
    {   
        try 
        {   
            var product = await _appDbContext.Products.FindAsync(id);

            if (product == null) {
                return true;
            }

            _appDbContext.AppFiles.RemoveRange(_appDbContext.AppFiles.Where(f => f.ProductId == id));
            _appDbContext.Products.Remove(product);
            await _appDbContext.SaveChangesAsync();
            return true;
        }
        catch (DbUpdateException e) 
        { 
            return false;
        } 
    }
}