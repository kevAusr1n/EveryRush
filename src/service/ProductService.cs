using System.Collections;
using System.Security.Cryptography.X509Certificates;
using EveryRush.Entity;
using Google.Apis.Drive.v3.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public class ProductService 
{   
    private readonly AppDbContext _appDbContext;

    public ProductService(AppDbContext appDbContext) 
    {
        _appDbContext = appDbContext;
    }

    public async Task<GetPaginatedProductsResponse> GetPaginatedProducts(
        int page, 
        int size,
        string keyword,
        string orderby,
        string order,
        int minimumPrice,
        int maxmiumPrice,
        string userId,
        string role) 
    {       
        IQueryable<Product> productsQuery = _appDbContext.Products.Where(p => p.Status != ProductStatus.DELETED);
        if (RoleConfig.BUSINESS_OWNER.Equals(role)) {
            productsQuery = productsQuery.Where(p => p.AppUserId.Equals(userId));
        } else {
            productsQuery = productsQuery.Where(p => p.Status != ProductStatus.OFF_SHELF);
        }
        if (minimumPrice != 0) 
        {
            productsQuery = productsQuery.Where(p => p.Price >= minimumPrice);
        }
        if (maxmiumPrice != 0) 
        {
            productsQuery = productsQuery.Where(p => p.Price <= maxmiumPrice);
        }
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
        if (RoleConfig.BUSINESS_OWNER.Equals(role)) {
            productsQuery = productsQuery.OrderBy(p => p.Status);
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
        Console.WriteLine("GetPaginatedProducts: " + response.Products.Count);
        foreach (Product product in response.Products) 
        {
            product.AppFiles = await _appDbContext.AppFiles
                .Where(f => f.ProductId == product.Id)
                .ToListAsync();
        }

        return response;
    }

    public async Task<Product> GetProduct(string id) 
    {
        return await _appDbContext.Products.Where(p => p.Id == id).FirstOrDefaultAsync();
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
            Stock = request.Stock,
            Status = request.Stock > 0 ? ProductStatus.IN_SALE : ProductStatus.OUT_OF_STOCK
        };
        List<AppFile> savedFiles = new List<AppFile>();
        if (request.Files != null && request.Files.Count > 0) 
        {
            foreach (IFormFile file in request.Files) 
            {
                using (var memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream);
                    
                    /*byte[] chkbytes = new byte[256];
                    memoryStream.Position = 0;
                    memoryStream.Read(chkbytes, 0, chkbytes.Length);
                    string format = "";

                    foreach (var signature in FileFormatMagicBytes._fileSignatures)
                    {
                        if (chkbytes.Take(signature.Key.Length).SequenceEqual(signature.Key))
                        {
                            format = signature.Value;
                        }
                    }*/
       
                    var imageUrl = Path.Combine(StaticFileRootPath.GetImagePath(), 
                    request.UserId + "-" + Guid.NewGuid().ToString() + "-" + DateTime.Now.ToString("yyyyMMddHHmmss") + "-image." + file.ContentType.Split("/")[1]);
                    var storePath = Path.Combine(StaticFileRootPath.GetStaticFileRootPath(), imageUrl);
                    AppFile newFile = new AppFile {
                        Id = Guid.NewGuid().ToString(),
                        Url = imageUrl,
                        ProductId = newProduct.Id,
                        Format = file.ContentType,
                    };
                    savedFiles.Add(newFile);
                    await file.CopyToAsync(new FileStream(storePath, FileMode.OpenOrCreate));
                }
            } 
        }
        newProduct.ImageUrl = String.Join(",", savedFiles.Select(f => f.Url));
        _appDbContext.Products.Add(newProduct);
        await _appDbContext.SaveChangesAsync();
        _appDbContext.AppFiles.AddRange(savedFiles);
        await _appDbContext.SaveChangesAsync();

        return newProduct;
    }

    public async Task<Boolean> UpdateProductStatus(string id, int newStatus) 
    {   
        var product = await _appDbContext.Products.FindAsync(id);
        if (product == null) 
        {
            return true;
        }
        if (newStatus == ProductStatus.IN_SALE) {
            newStatus = product.Stock != 0 ? newStatus : ProductStatus.OUT_OF_STOCK;
        }
        product.Status = newStatus;
        _appDbContext.Products.Update(product);
        await _appDbContext.SaveChangesAsync();

        return true;
    }
    
    public async Task<UpdateProductStockResponse> UpdateProductStock(string id, int newStock) 
    {   
        var product = await _appDbContext.Products.FindAsync(id);
        if (product == null) 
        {
            return new UpdateProductStockResponse {
                Result = OperationResult.FAILURE
            };
        }
        product.Stock = newStock;
        if (product.Stock == 0 && product.Status == ProductStatus.IN_SALE) {
            product.Status = ProductStatus.OUT_OF_STOCK;
        }
        if (product.Stock > 0 && product.Status == ProductStatus.OUT_OF_STOCK) {
            product.Status = ProductStatus.IN_SALE;
        }
        _appDbContext.Products.Update(product);
        await _appDbContext.SaveChangesAsync();

        return new UpdateProductStockResponse {
            Result = OperationResult.SUCCESS
        };
    }

    public async Task<Boolean> DeleteProduct(string id) 
    {   
        try 
        {   
            var product = await _appDbContext.Products.FindAsync(id);
            if (product == null) 
            {
                return true;
            }
            if (_appDbContext.PurchaseProductSnapshots.Where(o => o.ProductId == id).Count() > 0 ||
                _appDbContext.CartItems.Where(o => o.ProductId == id).Count() > 0) 
            {
                product.Status = ProductStatus.DELETED;
                _appDbContext.Products.Update(product);
                await _appDbContext.SaveChangesAsync();
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