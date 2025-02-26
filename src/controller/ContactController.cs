using EveryRush.Entity;
using EveryRush.Request;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace EveryRush.Controller;

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
    [Authorize(Roles = "Customer,BusinessOwner")]
    public async Task<ActionResult<GetContactsResponse>> GetPaginatedContacts(
        [FromQuery] string userId, 
        [FromQuery] int page = 1,
        [FromQuery] int size = 10) 
    {
        return await _contactService.GetPaginatedContacts(userId, page, size);
    }

    [HttpPost("add")]
    [Authorize(Roles = "Customer,BusinessOwner")]
    public async Task<ActionResult<Contact>> AddContact([FromBody] AddOrUpdateContactRequest request) 
    {
        return await _contactService.AddContact(request);
    }

    [HttpPost("edit")]
    [Authorize(Roles = "Customer,BusinessOwner")]
    public async Task<ActionResult<Contact>> EditContact([FromBody] AddOrUpdateContactRequest request) 
    {
        return await _contactService.EditContact(request);
    }

    [HttpDelete("delete/{id}")]
    [Authorize(Roles = "Customer,BusinessOwner")]
    public async Task<ActionResult<Boolean>> DeleteContact([FromRoute] string id) 
    {
        return await _contactService.DeleteContact(id);
    }
}