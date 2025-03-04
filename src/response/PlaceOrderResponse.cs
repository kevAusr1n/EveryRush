public class PlaceOrderResponse : ApiResponse {
    public IList<string> OrderIds {get; set;}

    public IList<string> FailedProductNames {get;set;}
}