using System.Text.Json.Serialization;
using Newtonsoft.Json;

public class GetContactsResponse {
    public IList<Contact> Contacts { get; set; }
}