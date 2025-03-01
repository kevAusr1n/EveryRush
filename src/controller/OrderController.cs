using System.Security.Claims;
using EveryRush.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EveryRush.Controller;

[Route("api/orders")]
[ApiController]
public class OrderController : ControllerBase 
{   
    private readonly AppDbContext _appDbContext;

    private readonly UserManager<AppUser> _userManager;

    public OrderController(AppDbContext appDbContext, UserManager<AppUser> userManager) {
        _appDbContext = appDbContext;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<ActionResult<GetPaginatedOrdersResponse>> GetPaginatedOrders(
        [FromQuery] string userId,
        [FromQuery] int? status,
        [FromQuery] string? searchTerm,
        [FromQuery] int page = 1,
        [FromQuery] int size = 10) 
    {
        var role = User.FindFirstValue(ClaimTypes.Role);
        
        var orderQuery = from order in _appDbContext.Orders select order;
        
        if (status != null) 
        {
            orderQuery = from order in orderQuery where order.Status == status select order;
        }
        if (!String.IsNullOrEmpty(searchTerm)) {
            orderQuery = 
            (   
                from order in orderQuery
                join purchaseProduct in _appDbContext.PurchaseProducts 
                on order.Id equals purchaseProduct.OrderId
                where order.Id == searchTerm || purchaseProduct.Name.Contains(searchTerm) 
                select order
            )
            .Distinct();
        }

        var orderAndProductJoinQuery = from order in orderQuery
            join purchaseProduct in _appDbContext.PurchaseProducts 
            on order.Id equals purchaseProduct.OrderId
            join buyer in _appDbContext.AppUsers
            on order.AppUserId equals buyer.Id
            join seller in _appDbContext.AppUsers
            on purchaseProduct.AppUserId equals seller.Id
            where RoleConfig.BUSINESS_OWNER.Equals(role) ? order.SellerId == userId : order.AppUserId == userId
            select new { order, buyer, seller, purchaseProduct };
        
        var orderAndProcessJoinQuery = from order in orderQuery
            join orderProcess in _appDbContext.OrderProcesses 
            on order.Id equals orderProcess.OrderId
            where RoleConfig.BUSINESS_OWNER.Equals(role) ? order.SellerId == userId : order.AppUserId == userId
            select new { order, orderProcess };

        var orderFindRelatedProductQuery = 
            from orderAndProduct in orderAndProductJoinQuery
            group orderAndProduct by orderAndProduct.order into orderProductGroup
            select new {
                Id = orderProductGroup.Key.Id,
                BuyerId = orderProductGroup.Key.AppUserId,
                SellerId = orderProductGroup.Select(o => o.seller).FirstOrDefault().Id,
                BuyerName = orderProductGroup.Select(o => o.buyer).FirstOrDefault().AlternativeName,
                SellerName = orderProductGroup.Select(o => o.seller).FirstOrDefault().AlternativeName,
                Status = orderProductGroup.Key.Status,
                FullName = orderProductGroup.Key.FullName,
                Email = orderProductGroup.Key.Email,
                Phone = orderProductGroup.Key.Phone,
                Address = orderProductGroup.Key.Address,
                TotalPrice = orderProductGroup.Key.TotalPrice,
                PurchaseProducts = orderProductGroup.Select(o => o.purchaseProduct).Select(p => new PurchaseProductView {
                    Id = p.Id,
                    AppUserId = p.AppUserId,
                    OrderId = p.OrderId,
                    ProductId = p.ProductId,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    ImageUrl = p.ImageUrl,
                    Quantity = p.Quantity
                }).ToList()
            };

        var orderFindRelatedProcessQuery = 
            from orderAndProcess in orderAndProcessJoinQuery
            group orderAndProcess by orderAndProcess.order into orderProcessGroup
            select new {
                Id = orderProcessGroup.Key.Id,
                OrderProcesses = orderProcessGroup.Select(o => o.orderProcess).Select(o => new OrderProcessView {
                    Id = o.Id,
                    OrderId = o.OrderId,
                    FromOrderStatus = o.FromOrderStatus,
                    ToOrderStatus = o.ToOrderStatus,
                    Comment = o.Comment,
                    Event = o.Event,
                    CreatedAt = o.CreatedAt
                }).ToList()
            };

        var orderDetailQuery = 
            from orderProductGroup in orderFindRelatedProductQuery
            join orderProcessGroup in orderFindRelatedProcessQuery
            on orderProductGroup.Id equals orderProcessGroup.Id
            select new OrderView {
                Id = orderProductGroup.Id,
                BuyerId = orderProductGroup.BuyerId,
                SellerId = orderProductGroup.SellerId,
                BuyerName = orderProductGroup.BuyerName,
                SellerName = orderProductGroup.SellerName,
                Status = orderProductGroup.Status,
                FullName = orderProductGroup.FullName,
                Email = orderProductGroup.Email,
                Phone = orderProductGroup.Phone,
                Address = orderProductGroup.Address,
                TotalPrice = orderProductGroup.TotalPrice,
                PurchaseProducts = orderProductGroup.PurchaseProducts,
                OrderProcesses = orderProcessGroup.OrderProcesses
            };
       
        var totalCount = orderDetailQuery.Count();
        var totalPages = (int)Math.Ceiling((double)totalCount / size); 
        orderDetailQuery = orderDetailQuery.Skip((page - 1) * size).Take(size);

        return new GetPaginatedOrdersResponse() {
            TotalCount = totalCount,
            TotalPages = totalPages,
            Orders = orderDetailQuery.ToList()
        };
    }

    [HttpPost("place")]
    [Authorize(Roles = "Customer")]
    public async Task<ActionResult<PlaceOrderResponse>> PlaceOrderAsync([FromBody] PlaceOrderRequest request) 
    {
        List<Order> orders = new List<Order>();
        List<PurchaseProduct> purchaseProductSnapshots = new List<PurchaseProduct>();
        List<OrderProcess> orderProcesses = new List<OrderProcess>();
        List<Product> productsForUpdate = new List<Product>();

        foreach (OrderRquest orderRequest in request.OrderRquests) {
            AppUser user = await _userManager.FindByIdAsync(orderRequest.UserId);
            if (user == null) 
            {
                return new PlaceOrderResponse {
                    Result = RequestResult.FAILURE,
                    Comment = RequestResult.Comment.USER_NOT_EXIST
                };
            }

            if (orderRequest.PurchaseProducts.Count == 0) 
            {
                return new PlaceOrderResponse {
                    Result = RequestResult.FAILURE
                };
            }
            var products = _appDbContext.Products
                .AsEnumerable()
                .Where(p => orderRequest.PurchaseProducts.Select(op => op.Id).Contains(p.Id))
                .ToList();

            if (orderRequest.PurchaseProducts.Count != products.Count) 
            {
                return new PlaceOrderResponse {
                    Result = RequestResult.FAILURE
                };
            }
            products = products.OrderBy(p => p.Id).ToList();
            orderRequest.PurchaseProducts = orderRequest.PurchaseProducts.OrderBy(p => p.Id).ToList();
            decimal totalPrice = 0;
            for (int i = 0; i < products.Count; i++) 
            {
                if (orderRequest.PurchaseProducts[i].Quantity <= 0 || orderRequest.PurchaseProducts[i].Quantity > products[i].Stock)
                {
                    return new PlaceOrderResponse {
                        Result = RequestResult.FAILURE
                    };
                }
                products[i].Stock -= orderRequest.PurchaseProducts[i].Quantity;
                totalPrice += products[i].Price * orderRequest.PurchaseProducts[i].Quantity;
            }
            Order order = new Order() {
                Id = Guid.NewGuid().ToString(),
                AppUserId = orderRequest.UserId,
                SellerId = products.First().AppUserId,
                Status = OrderStatus.PENDING,
                CreatedAt = DateTime.Now,
                FullName = orderRequest.FullName,
                Email = orderRequest.Email,
                Phone = orderRequest.Phone,
                Address = orderRequest.Address,
                TotalPrice = totalPrice
            };

            IList<PurchaseProduct> purchaseProductSnapshotsForThisOrder = orderRequest.PurchaseProducts.Select(purchaseProduct => new PurchaseProduct {
                Id = Guid.NewGuid().ToString(),
                AppUserId = products.Where(p => p.Id == purchaseProduct.Id).First().AppUserId,
                OrderId = order.Id,
                ProductId = purchaseProduct.Id,
                Name = products.Where(p => p.Id == purchaseProduct.Id).First().Name,
                Description = products.Where(p => p.Id == purchaseProduct.Id).First().Description,
                ImageUrl = products.Where(p => p.Id == purchaseProduct.Id).First().ImageUrl,
                Price = products.Where(p => p.Id == purchaseProduct.Id).First().Price,
                Quantity = purchaseProduct.Quantity,
                CreatedAt = DateTime.Now
            }).ToList();

            OrderProcess orderProcessForThisOrder = new OrderProcess() {
                Id = Guid.NewGuid().ToString(),
                OrderId = order.Id,
                FromOrderStatus = OrderStatus.PENDING,
                ToOrderStatus = OrderStatus.PENDING,
                Event = "Order Placed",
                CreatedAt = DateTime.Now
            };

            orders.Add(order);
            orderProcesses.Add(orderProcessForThisOrder);
            purchaseProductSnapshots.AddRange(purchaseProductSnapshotsForThisOrder);
            productsForUpdate.AddRange(products);
        }

        List<CartItem> cartItems = _appDbContext.CartItems.Where(c => c.AppUserId == request.OrderRquests[0].UserId).ToList();

        _appDbContext.Orders.AddRange(orders);
        _appDbContext.PurchaseProducts.AddRange(purchaseProductSnapshots);
        _appDbContext.OrderProcesses.AddRange(orderProcesses);
        _appDbContext.Products.UpdateRange(productsForUpdate);
        _appDbContext.CartItems.RemoveRange(cartItems);

        await _appDbContext.SaveChangesAsync();

        return new PlaceOrderResponse {
            Result = RequestResult.SUCCESS
        };
    }

    [HttpPost("status-update/{orderId}")]
    [Authorize(Roles = "BusinessOwner")]
    public async Task<ActionResult<Order>> UpdateOrderStatus([FromRoute] string orderId, [FromBody] UpdateOrderStatusRequest request) 
    {
        return null;
    }
}