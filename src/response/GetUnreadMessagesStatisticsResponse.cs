public class GetUnreadMessagesStatisticsResponse 
{
    public int TotalCount {get;set;}
    public int TotalPages {get;set;}

    public IList<UnreadSenderReview> UnreadSenders {get;set;}
}