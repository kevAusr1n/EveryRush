using EveryRush.Entity;
using EveryRush.Request;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace EveryRush.Controller;

[AllowAnonymous]
[Route("api/auth")]
[ApiController]
public class ContactController : ControllerBase 
{
    private readonly ContactService _contactService;

    public ContactController(ContactService contactService) 
    {
        _contactService = contactService;
    }

    [HttpGet("contacts/{userid}")]
    public async Task<ActionResult<GetContactsResponse>> GetAllContacts([FromRoute] string userId) 
    {
        return await _contactService.GetAllContacts(userId);
    }

    [HttpPost("contacts/add")]
    public async Task<ActionResult<Contact>> AddContact([FromBody] AddContactRequest request) 
    {
        return await _contactService.AddContact(request);
    }

    [HttpPost("contacts/edit")]
    public async Task<ActionResult<Contact>> EditContact([FromBody] EditContactRequest request) 
    {
        return await _contactService.EditContact(request);
    }

    [HttpDelete("contacts/delete/{id}")]
    public async Task<ActionResult<Boolean>> DeleteContact([FromRoute] string id) 
    {
        return await _contactService.DeleteContact(id);
    }
}