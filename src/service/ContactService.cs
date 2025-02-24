using EveryRush.Entity;
using Google.Apis.Drive.v3.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public class ContactService 
{   
    private readonly AppDbContext _appDbContext;

    public ContactService(AppDbContext appDbContext) 
    {
        _appDbContext = appDbContext;
    }

    public async Task<GetContactsResponse> GetPaginatedContacts(string userId, int page, int size) 
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

    public async Task<Contact> AddContact(AddOrUpdateContactRequest request) 
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

    public async Task<Contact> EditContact(AddOrUpdateContactRequest request) 
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

    public async Task<Boolean> DeleteContact(string id) {
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