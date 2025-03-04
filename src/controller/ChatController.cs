using System.Security.Claims;
using EveryRush.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EveryRush.Controller;

[Route("api/chat/messages")]
[ApiController]
public class ChatController : ControllerBase 
{   
    private readonly AppDbContext _appDbContext;

    public ChatController(AppDbContext appDbContext) {
        _appDbContext = appDbContext;
    }

    [HttpGet]
    [Authorize(Roles = "Customer,BusinessOwner")]
    public async Task<ActionResult<GetConversationChatMessageResponse>> GetChatMessagesForConversation([FromQuery] string userId, [FromQuery] int retrieveNum) {
        return new GetConversationChatMessageResponse {
            ChatMessages = await _appDbContext.ChatMessages
                .Where(c => c.FromUserId == userId || c.ToUserId == userId)
                .OrderByDescending(c => c.CreatedAt)
                .Take(retrieveNum)
                .OrderBy(c => c.CreatedAt)
                .ToListAsync()
        };
    }

    [HttpGet("unread/{userId}")]
    [Authorize(Roles = "Customer,BusinessOwner")]
    public async Task<ActionResult<GetUnreadMessagesStatisticsResponse>> GetUnreadMessagesStatistics([FromRoute] string userId, [FromQuery] int paeg, [FromQuery] int size) {
        // TODO: Add pagination
        var totalCount = await _appDbContext.ChatMessages
                .Where(c => c.ToUserId == userId && c.Status == ChatMessageDefinition.Status.UNREAD)
                .CountAsync();
        var totalPages = (int)Math.Ceiling((double)totalCount / size); 
        var unreadStatisticQuery = 
            from chatMessage in _appDbContext.ChatMessages
            join user in _appDbContext.AppUsers 
            on chatMessage.FromUserId equals user.Id
            where chatMessage.ToUserId == userId && chatMessage.Status == ChatMessageDefinition.Status.UNREAD
            select new { chatMessage, user };

        IList<UnreadSenderReview> unreadSenders = 
        (
            from unreadStatistic in unreadStatisticQuery
            group unreadStatistic by unreadStatistic.user into g
            select new UnreadSenderReview {
                SenderId = g.Key.Id,
                SenderName = g.Key.AlternativeName,
                UnreadCount = g.Count()
            }
        ).ToList();
            
        return new GetUnreadMessagesStatisticsResponse {
            TotalCount = totalCount,
            TotalPages = totalPages,
            UnreadSenders = unreadSenders
        };
    }
}