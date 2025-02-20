using Microsoft.AspNetCore.Identity;

namespace EveryRush.Entity;

public class AppUser : IdentityUser { 
    public string? AlternativeName {get; set;}
    public ICollection<Contact>? Contacts { get; set;}
    public ICollection<Order>? Orders { get; set;}
    public ICollection<CartItem>? CartItems { get; set;}

    public ICollection<Product>? Products { get; set;}
}