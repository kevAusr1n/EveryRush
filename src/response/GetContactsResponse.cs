using System.Text.Json.Serialization;
using Newtonsoft.Json;

public class GetContactsResponse {
    public int TotalPages { get; set; } = 0;
    public int TotalCount { get; set; } = 0;
    public IList<Contact> Contacts { get; set; }
}