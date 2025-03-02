public class GetPaginatedReviewsResponse
{
    public int TotalCount {get;set;}
    public int TotalPages {get;set;}

    public IList<ProductReviewView> Reviews {get;set;}
}