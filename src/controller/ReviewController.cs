using System.Drawing;
using System.Security.Claims;
using EveryRush.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EveryRush.Controller;

[Route("api/reviews")]
[ApiController]
public class ReviewController : ControllerBase 
{   
    private readonly AppDbContext _appDbContext;

    public ReviewController(AppDbContext appDbContext) {
        _appDbContext = appDbContext;
    }

    [HttpPost]
    [Authorize(Roles = "Customer,BusinessOwner")]
    public async Task<ActionResult<WriteReviewResponse>> WriteReview([FromBody] WriteReviewRequest request) {
        if (ProductReviewConfig.Type.REVIEW == request.Type) {
            var isReviewExisted = _appDbContext.ProductReviews
                .Where(r => r.ProductId == request.ProductId && r.OrderId == request.OrderId && r.AppUserId == request.UserId).Any();
            if (isReviewExisted) {
                return new WriteReviewResponse {
                    Result = RequestResult.FAILURE
                };
            }
        }
        ProductReview review = new ProductReview {
            Id = Guid.NewGuid().ToString(),
            ProductId = request.ProductId,
            OrderId = request.OrderId,
            AppUserId = request.UserId,
            Type = request.Type,
            Content = request.Content,
            Rating = request.Rating,
            CreatedAt = DateTime.Now
        };
        _appDbContext.ProductReviews.Add(review);
        await _appDbContext.SaveChangesAsync();

        return new WriteReviewResponse {
            Result = RequestResult.SUCCESS 
        };
    }

    [HttpGet]
    public async Task<ActionResult<GetPaginatedReviewsResponse>> GetPaginatedReviews(
        [FromQuery] string productId,
        [FromQuery] int page = 1,
        [FromQuery] int size = 10
    ) 
    {
        var totalCount = await _appDbContext.ProductReviews
                .Where(c => c.ProductId == productId)
                .CountAsync();
        var totalPages = (int)Math.Ceiling((double)totalCount / size);
        var reviewQuery = 
            from review in _appDbContext.ProductReviews
            join user in _appDbContext.AppUsers on review.AppUserId equals user.Id
            where review.ProductId == productId && review.Type == ProductReviewConfig.Type.REVIEW
            select new ProductReviewView {
                Id = review.Id,
                ProductId = review.ProductId,
                OrderId = review.OrderId,
                ReviewerId = review.AppUserId,
                ReviewerName = user.AlternativeName,
                Type = review.Type,
                Content = review.Content,
                Rating = review.Rating,
                CreatedAt = review.CreatedAt,
            };
        return new GetPaginatedReviewsResponse {
            TotalCount = totalCount,
            TotalPages = totalPages,
            Reviews = await reviewQuery.Skip((page - 1) * size).Take(size).ToListAsync()
        };
    }
}