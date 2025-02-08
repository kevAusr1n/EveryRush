using System.Text.Json.Serialization;

public class GetContactsResponse {
    [JsonPropertyName("contacts")]
    public IList<Contact> Contacts { get; set; }
}