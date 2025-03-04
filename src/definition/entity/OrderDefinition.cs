public class OrderDefinition
{
    public class Status 
    {
        public static readonly int PENDING = 0;
        public static int ACCEPTED = 1;
        public static int REJECTED = 2;
        public static int IN_DELIVERY = 3;
        public static int FINISHED = 4;
        public static int REFUND_REQUESTED = 5;
        public static int REFUND_REJECTED = 6;
        public static int REFUND_ARROVED = 7;
        public static int REFUNDED = 8;
    }
    public static int currentOrderStatus;
    
    public void At(int currentStatus) 
    {
        currentOrderStatus = currentStatus;
    }

    public Boolean Next(int nextStatus) 
    {
        return AllowableOrderStatusTransition.DICTIONARY[currentOrderStatus].Contains(nextStatus);
    }
}

public class AllowableOrderStatusTransition 
{
    public static readonly Dictionary<int, List<int>> DICTIONARY = new Dictionary<int, List<int>> 
    {
        {OrderDefinition.Status.PENDING, new List<int> {OrderDefinition.Status.ACCEPTED, OrderDefinition.Status.REJECTED, OrderDefinition.Status.REFUND_REQUESTED}},
        {OrderDefinition.Status.ACCEPTED, new List<int> {OrderDefinition.Status.REFUND_REQUESTED, OrderDefinition.Status.IN_DELIVERY}},
        {OrderDefinition.Status.REFUND_REQUESTED, new List<int> {OrderDefinition.Status.REFUND_REJECTED, OrderDefinition.Status.REFUND_ARROVED}},
        {OrderDefinition.Status.IN_DELIVERY, new List<int> {OrderDefinition.Status.REFUND_REQUESTED}},
        {OrderDefinition.Status.FINISHED, new List<int> {OrderDefinition.Status.REFUND_REQUESTED}},
        {OrderDefinition.Status.REJECTED, new List<int>()},
        {OrderDefinition.Status.REFUND_REJECTED, new List<int>()},
        {OrderDefinition.Status.REFUND_ARROVED, new List<int>(OrderDefinition.Status.REFUNDED)},
        {OrderDefinition.Status.REFUNDED, new List<int>()},
    };
}