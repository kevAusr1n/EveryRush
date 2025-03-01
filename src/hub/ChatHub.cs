

using System.Security.Claims;
using EveryRush.Entity;
using Microsoft.AspNetCore.SignalR;
using PostmarkDotNet.Model;

public class ChatHub : Hub
{   
    private readonly AppDbContext _appDbContext;

    
    private string AnotherUserConnectionId = "";

    public ChatHub(AppDbContext appDbContext)
    {
        _appDbContext = appDbContext;
    }

    public async Task SendMessage(string toUserId, string message) 
    {
        _appDbContext.ChatMessages.Add(new ChatMessage
        {
            Id = Guid.NewGuid().ToString(),
            FromUserId = Context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value,
            ToUserId = toUserId,
            Content = message
        });
        await _appDbContext.SaveChangesAsync();
     
        await Clients.User(toUserId).SendAsync("ReceiveMessage", toUserId, message);
        await Clients.Caller.SendAsync("ReceiveMessage", "", message);
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        return base.OnDisconnectedAsync(exception);
    }
}