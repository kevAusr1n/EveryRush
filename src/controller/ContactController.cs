using EveryRush.Entity;
using EveryRush.Request;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace EveryRush.Controller;

[AllowAnonymous]
[Route("api/contacts")]
[ApiController]
public class ContactController : ControllerBase 
{
    private readonly ContactService _contactService;

    public ContactController(ContactService contactService) 
    {
        _contactService = contactService;
    }

    [HttpGet]
    public async Task<ActionResult<GetContactsResponse>> GetAllContacts([FromQuery] string userId) 
    {
        return await _contactService.GetAllContacts(userId);
    }

    [HttpPost("add")]
    public async Task<ActionResult<Contact>> AddContact([FromBody] AddOrUpdateContactRequest request) 
    {
        return await _contactService.AddContact(request);
    }

    [HttpPost("edit")]
    public async Task<ActionResult<Contact>> EditContact([FromBody] AddOrUpdateContactRequest request) 
    {
        return await _contactService.EditContact(request);
    }

    [HttpDelete("delete/{id}")]
    public async Task<ActionResult<Boolean>> DeleteContact([FromRoute] string id) 
    {
        return await _contactService.DeleteContact(id);
    }
}