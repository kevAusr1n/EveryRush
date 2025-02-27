using EveryRush.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

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
        var orderQuery = from order in _appDbContext.Orders select order;
        
        if (status != null) 
        {
            orderQuery = from order in orderQuery where order.Status == status select order;
        }
        if (!String.IsNullOrEmpty(searchTerm)) {
            orderQuery = 
                from order in orderQuery
                join purchaseProductSnapshot in _appDbContext.PurchaseProductSnapshots 
                on order.Id equals purchaseProductSnapshot.OrderId
                where order.Id == searchTerm || purchaseProductSnapshot.ProductName.Contains(searchTerm) 
                select order;
        }

        var orderResponseQuery = 
            from order in orderQuery
            join orderProcess in _appDbContext.OrderProcesses
            on order.Id equals orderProcess.OrderId
            join purchaseProductSnapshot in _appDbContext.PurchaseProductSnapshots 
            on order.Id equals purchaseProductSnapshot.OrderId
            join buyer in _appDbContext.AppUsers
            on order.AppUserId equals buyer.Id
            join seller in _appDbContext.AppUsers
            on purchaseProductSnapshot.AppUserId equals seller.Id
            where order.AppUserId == userId
            group order by order into orderGroup 
            select new OrderResponse {
                Id = orderGroup.Key.Id,
                Status = orderGroup.Key.Status,
                FullName = orderGroup.Key.FullName,
                Email = orderGroup.Key.Email,
                Phone = orderGroup.Key.Phone,
                Address = orderGroup.Key.Address,
                PurchaseProductSnapshots = orderGroup.Select(p => p.PurchaseProductSnapshots).FirstOrDefault().ToList(),
                OrderProcesses = orderGroup.Select(p => p.OrderProcesses).FirstOrDefault().ToList()
            };

        var totalCount = orderResponseQuery.Count();
        var totalPages = (int)Math.Ceiling((double)totalCount / size); 
        orderResponseQuery = orderResponseQuery.Skip((page - 1) * size).Take(size);

        return new GetPaginatedOrdersResponse() {
            TotalCount = totalCount,
            TotalPages = totalPages,
            Orders = orderResponseQuery.ToList()
        };
    }

    [HttpPost("make")]
    [Authorize(Roles = "Customer")]
    public async Task<ActionResult<PlaceOrderResponse>> PlaceOrderAsync([FromBody] PlaceOrderRequest request) 
    {
        List<Order> orders = new List<Order>();
        List<PurchaseProductSnapshot> purchaseProductSnapshots = new List<PurchaseProductSnapshot>();
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
            IList<string> cartItemIds = orderRequest.CartItems.Select(p => p.ProductId).ToList();
            if (cartItemIds.Count == 0) 
            {
                return new PlaceOrderResponse {
                    Result = RequestResult.FAILURE
                };
            }
            List<Product> products = _appDbContext.Products.Where(p => cartItemIds.Contains(p.Id)).Distinct().ToList();
            if (cartItemIds.Count != products.Count) 
            {
                return new PlaceOrderResponse {
                    Result = RequestResult.FAILURE
                };
            }
            products = products.OrderBy(p => cartItemIds.IndexOf(p.Id)).ToList();
            orderRequest.CartItems = orderRequest.CartItems.OrderBy(snapshot => snapshot.ProductId).ToList();

            for (int i = 0; i < products.Count; i++) 
            {
                if (orderRequest.CartItems[i].Quantity <= 0 || orderRequest.CartItems[i].Quantity > products[i].Stock)
                {
                    return new PlaceOrderResponse {
                        Result = RequestResult.FAILURE
                    };
                }
                products[i].Stock -= orderRequest.CartItems[i].Quantity;

            }
            Order order = new Order() {
                Id = Guid.NewGuid().ToString(),
                AppUserId = orderRequest.UserId,
                Status = OrderStatus.PENDING,
                CreatedAt = DateTime.Now,
                FullName = orderRequest.FullName,
                Email = orderRequest.Email,
                Phone = orderRequest.Phone,
                Address = orderRequest.Address
            };

            IList<PurchaseProductSnapshot> purchaseProductSnapshotsForThisOrder = orderRequest.CartItems.Select(cartItem => new PurchaseProductSnapshot {
                Id = Guid.NewGuid().ToString(),
                OrderId = order.Id,
                ProductId = cartItem.ProductId,
                ProductName = products.Where(p => p.Id == cartItem.ProductId).First().Name,
                ProductDescription = products.Where(p => p.Id == cartItem.ProductId).First().Description,
                ProductImageUrl = products.Where(p => p.Id == cartItem.ProductId).First().ImageUrl,
                Price = products.Where(p => p.Id == cartItem.ProductId).First().Price,
                Quantity = cartItem.Quantity,
                CreateAt = DateTime.Now
            }).ToList();

            OrderProcess orderProcessForThisOrder = new OrderProcess() {
                Id = Guid.NewGuid().ToString(),
                OrderId = order.Id,
                FromOrderStatus = OrderStatus.PENDING,
                ToOrderStatus = OrderStatus.PENDING,
                FromUserId = orderRequest.UserId,
                ToUserId = products.First().AppUserId,
                Event = "Order Created",
                CreateAt = DateTime.Now
            };

            orders.Add(order);
            orderProcesses.Add(orderProcessForThisOrder);
            purchaseProductSnapshots.AddRange(purchaseProductSnapshotsForThisOrder);
            productsForUpdate.AddRange(products);
        }

        _appDbContext.Orders.AddRange(orders);
        _appDbContext.PurchaseProductSnapshots.AddRange(purchaseProductSnapshots);
        _appDbContext.OrderProcesses.AddRange(orderProcesses);
        _appDbContext.Products.UpdateRange(productsForUpdate);

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