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

    public async Task<GetPaginatedProductsResponse> GetPaginatedProducts(
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

        var response = new GetPaginatedProductsResponse {
            TotalCount = totalCount,
            TotalPages = totalPages,
            Products = await productsQuery
            .Skip((page - 1) * size)
            .Take(size)
            .ToListAsync()
        };

        Console.WriteLine("GetPaginatedProducts: " + response.Products.Count);

        foreach (Product product in response.Products) {
            product.AppFiles = await _appDbContext.AppFiles
                .Where(f => f.ProductId == product.Id)
                .ToListAsync();
        }

        return response;
    }

    public async Task<Product> AddProduct(AddOrUpdateProductRequest request) 
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
        
        List<AppFile> savedFiles = new List<AppFile>();

        if (request.Files != null && request.Files.Count > 0) 
        {
            foreach (IFormFile file in request.Files) 
            {
                var thisUrl = request.UserId + "-" + DateTime.Now.ToString("yyyyMMddHHmmss") 
                    + "-" + file.ContentType;

                using (var memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream);
                    
                    byte[] chkbytes = new byte[256];
                    memoryStream.Position = 0;
                    memoryStream.Read(chkbytes, 0, chkbytes.Length);
                    string format = "";

                    foreach (var signature in FileFormatMagicBytes._fileSignatures)
                    {
                        if (chkbytes.Take(signature.Key.Length).SequenceEqual(signature.Key))
                        {
                            format = signature.Value;
                        }
                    }
                    
                    AppFile newFile = new AppFile {
                        Id = Guid.NewGuid().ToString(),
                        Name = thisUrl,
                        ProductId = newProduct.Id,
                        Content = memoryStream.ToArray(),
                        Format = format,
                    };

                    savedFiles.Add(newFile);
                }
            } 
        }

        newProduct.ImageUrl = String.Join(",", savedFiles.Select(f => f.Name));
        _appDbContext.Products.Add(newProduct);
        await _appDbContext.SaveChangesAsync();

        _appDbContext.AppFiles.AddRange(savedFiles);
        await _appDbContext.SaveChangesAsync();

        return newProduct;
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