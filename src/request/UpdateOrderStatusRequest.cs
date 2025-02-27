public class UpdateOrderStatusRequest {
    public int? NewStatus {get; set;}

    // this is for giving postage informatioin
    public string? AdditionalInformation {get; set;}
}