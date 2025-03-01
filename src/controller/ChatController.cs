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
    public async Task<ActionResult<GetChatMessageResponse>> GetChatMessages([FromQuery] string userId, [FromQuery] int retrieveNum) {
        return new GetChatMessageResponse {
            ChatMessages = await _appDbContext.ChatMessages.Where(c => c.FromUserId == userId || c.ToUserId == userId).OrderByDescending(c => c.CreatedAt).Take(retrieveNum).ToListAsync()
        };
    }
}