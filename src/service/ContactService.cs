using EveryRush.Entity;
using Google.Apis.Drive.v3.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public class ContactService 
{   
    private readonly ContactDbContext _contactDbContext;
    private readonly IAuthorizationService _authorizationService;

    public ContactService(
        ContactDbContext contactDbContext,
        IAuthorizationService authorizationService) 
    {
        _contactDbContext = contactDbContext;
        _authorizationService = authorizationService;
    }

    public async Task<GetContactsResponse> GetAllContacts(string userId) 
    {       
        IList<Contact> contacts = await _contactDbContext.Contacts.Where(c => c.OwnerId == userId).ToListAsync();
        return new GetContactsResponse() {
            Contacts = contacts
        };
    }

    public async Task<Contact> AddContact(AddContactRequest request) 
    {   
        Contact newContact = new Contact() {
            Id = Guid.NewGuid().ToString(),
            OwnerId = request.OwnerId,
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
            _contactDbContext.Contacts.Add(newContact);
            await _contactDbContext.SaveChangesAsync();
            return newContact;
        }
        catch (DbUpdateException e) 
        {
            return new Contact();
        } 
    }

    public async Task<Contact> EditContact(EditContactRequest request) 
    {   
        Contact contactForUpdate = _contactDbContext.Contacts.FirstOrDefault(c => c.Id == request.Id);
        
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
            _contactDbContext.Contacts.Update(contactForUpdate);
            await _contactDbContext.SaveChangesAsync();
            return contactForUpdate;
        }
        catch (DbUpdateException e) 
        {
            return new Contact();
        } 
    }

    public async Task<Boolean> DeleteContact(string id) {
        Contact contactForDelete = _contactDbContext.Contacts.FirstOrDefault(c => c.Id == id);

        if (contactForDelete == null) {
            return true;
        }

        try 
        {
            _contactDbContext.Contacts.Remove(contactForDelete);
            await _contactDbContext.SaveChangesAsync();
            return true;
        }
        catch (DbUpdateException e) 
        {
            return false;
        } 
    }
}