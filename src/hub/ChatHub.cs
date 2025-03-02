

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
        string messasgeId = Guid.NewGuid().ToString();
        _appDbContext.ChatMessages.Add(new ChatMessage
        {
            Id = messasgeId,
            FromUserId = Context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value,
            ToUserId = toUserId,
            Content = message,
            CreatedAt = DateTime.Now,
            Status = ChatMessageConfig.Status.UNREAD
        });
        await _appDbContext.SaveChangesAsync();
     
        await Clients.User(toUserId).SendAsync("ReceiveMessage", messasgeId, toUserId, message);
        await Clients.Caller.SendAsync("ReceiveMessage", "", "", message);
    }

    public async Task MarkMessageAsRead(string messasgeId) 
    {
        var chatMessage = _appDbContext.ChatMessages.Where(m => m.Id == messasgeId).First();
        chatMessage.Status = ChatMessageConfig.Status.READ;
        await _appDbContext.SaveChangesAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        return base.OnDisconnectedAsync(exception);
    }
}