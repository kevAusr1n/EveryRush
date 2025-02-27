using EveryRush.Entity;
using Google.Apis.Drive.v3.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public class OrderService
{   
    private readonly AppDbContext _appDbContext;
    private readonly UserManager<AppUser> _userManager;

    public OrderService(AppDbContext appDbContext, UserManager<AppUser> userManager) 
    {
        _appDbContext = appDbContext;
        _userManager = userManager;
    }

    public async Task<GetPaginatedOrdersResponse> GetPaginatedOrders(
        string userId,
        int page,
        int size) 
    {       
        return null;
    }

    public async Task<Order> MakeOrder(PlaceOrderRequest request) 
    {   
        AppUser user = await _userManager.FindByIdAsync(request.UserId);
        if (user == null) 
        {
            throw new Exception("User not found");
        }
        IList<string> purchasedProductIds = request.PurchaseProductSnapshots.Select(p => p.ProductId).ToList();
        if (purchasedProductIds.Count == 0) 
        {
            throw new Exception("No products purchased");
        }
        List<Product> products = await _appDbContext.Products.Where(p => purchasedProductIds.Contains(p.Id)).Distinct().ToListAsync();
        if (purchasedProductIds.Count != products.Count) 
        {
            throw new Exception("Some products not found");
        }
        products = products.OrderBy(p => purchasedProductIds.IndexOf(p.Id)).ToList();
        request.PurchaseProductSnapshots = request.PurchaseProductSnapshots.OrderBy(snapshot => snapshot.ProductId).ToList();

        for (int i = 0; i < products.Count; i++) 
        {
            if (request.PurchaseProductSnapshots[i].Quantity <= 0 || request.PurchaseProductSnapshots[i].Quantity > products[i].Stock)
            {
                throw new Exception("Invalid quantity");
            }
            products[i].Stock -= request.PurchaseProductSnapshots[i].Quantity;

        }
        Order order = new Order() {
            Id = Guid.NewGuid().ToString(),
            AppUserId = request.UserId,
            PurchaseProductSnapshots = request.PurchaseProductSnapshots,
            Processes = new List<OrderProcess> {
                new OrderProcess {
                    Id = Guid.NewGuid().ToString()
                }
            }
            // TODO: add shipping address
        };

        _appDbContext.Orders.Add(order);
        _appDbContext.OrderProcesses.AddRange(order.Processes);
        _appDbContext.Products.UpdateRange(products);
        await _appDbContext.SaveChangesAsync();
        return order;
    }

    public async Task<Order> GetOrder(string orderId) 
    {
        
        return null;
    }
}