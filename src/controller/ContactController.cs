using EveryRush.Entity;
using EveryRush.Request;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EveryRush.Controller;

[Route("api/contacts")]
[ApiController]
public class ContactController : ControllerBase 
{
    private readonly AppDbContext _appDbContext;
    public ContactController(AppDbContext appDbContext) 
    {
        _appDbContext = appDbContext;
    }

    [HttpGet]
    [Authorize(Roles = "Customer,BusinessOwner")]
    public async Task<ActionResult<GetContactsResponse>> GetPaginatedContacts(
        [FromQuery] string userId, 
        [FromQuery] int page = 1,
        [FromQuery] int size = 10) 
    {
        var totalCount = await _appDbContext.Contacts.Where(c => c.AppUserId == userId).CountAsync();
        var totalPages = (int)Math.Ceiling((double)totalCount / size);

        IList<Contact> contacts = await _appDbContext.Contacts
            .Where(c => c.AppUserId == userId)
            .Skip((page - 1) * size)
            .Take(size)
            .ToListAsync();

        return new GetContactsResponse() {
            TotalPages = totalPages,
            TotalCount = totalCount,
            Contacts = contacts
        };
    }

    [HttpPost("add")]
    [Authorize(Roles = "Customer,BusinessOwner")]
    public async Task<ActionResult<Contact>> AddContact([FromBody] AddOrUpdateContactRequest request) 
    {
        Contact newContact = new Contact() {
            Id = Guid.NewGuid().ToString(),
            AppUserId = request.UserId,
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            Phone = request.Phone,
            Address = request.Address,
            City = request.City,
            State = request.State,
            Postcode = request.Postcode,
        };
        try 
        {
            _appDbContext.Contacts.Add(newContact);
            await _appDbContext.SaveChangesAsync();

            return newContact;
        }
        catch (DbUpdateException e) 
        {
            return new Contact();
        } 
    }

    [HttpPost("edit")]
    [Authorize(Roles = "Customer,BusinessOwner")]
    public async Task<ActionResult<Contact>> EditContact([FromBody] AddOrUpdateContactRequest request) 
    {
        Contact contactForUpdate = _appDbContext.Contacts.FirstOrDefault(c => c.Id == request.Id);
        if (contactForUpdate == null) 
        {
            return new Contact();
        }
        contactForUpdate.FirstName = request.FirstName;
        contactForUpdate.LastName = request.LastName;
        contactForUpdate.Email = request.Email;
        contactForUpdate.Phone = request.Phone;
        contactForUpdate.Address = request.Address;
        contactForUpdate.City = request.City;
        contactForUpdate.State = request.State;
        contactForUpdate.Postcode = request.Postcode;
        try 
        {
            _appDbContext.Contacts.Update(contactForUpdate);
            await _appDbContext.SaveChangesAsync();
            
            return contactForUpdate;
        }
        catch (DbUpdateException e) 
        {
            return new Contact();
        } 
    }

    [HttpDelete("delete/{id}")]
    [Authorize(Roles = "Customer,BusinessOwner")]
    public async Task<ActionResult<Boolean>> DeleteContact([FromRoute] string id) 
    {
        Contact contactForDelete = _appDbContext.Contacts.FirstOrDefault(c => c.Id == id);
        if (contactForDelete == null) 
        {
            return true;
        }

        try 
        {
            _appDbContext.Contacts.Remove(contactForDelete);
            await _appDbContext.SaveChangesAsync();

            return true;
        }
        catch (DbUpdateException e) 
        {
            return false;
        } 
    }
}