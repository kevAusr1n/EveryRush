using System.Reflection.Metadata;

public class OrderStatus {
    public static readonly int PENDING = 0;
    public static int ACCEPTED = 1;
    public static int REJECTED = 2;
    public static int IN_DELIVERY = 3;
    public static int FINISHED = 4;
    public static int REFUND_REQUIRED = 5;
    public static int REFUND_REJECTED = 6;
    public static int REFUNDED = 7;
}

public class AllowableStatusTransition {
    public static readonly Dictionary<int, List<int>> DICTIONARY = new Dictionary<int, List<int>> {
        {OrderStatus.PENDING, new List<int> {OrderStatus.ACCEPTED, OrderStatus.REJECTED, OrderStatus.REFUND_REQUIRED}},
        {OrderStatus.ACCEPTED, new List<int> {OrderStatus.REFUND_REQUIRED, OrderStatus.IN_DELIVERY}},
        {OrderStatus.REFUND_REQUIRED, new List<int> {OrderStatus.REFUND_REJECTED, OrderStatus.REFUNDED}},
        {OrderStatus.IN_DELIVERY, new List<int> {OrderStatus.REFUND_REQUIRED}},
        {OrderStatus.FINISHED, new List<int> {OrderStatus.REFUND_REQUIRED}},
        {OrderStatus.REJECTED, new List<int>()},
        {OrderStatus.REFUND_REJECTED, new List<int>()},
        {OrderStatus.REFUNDED, new List<int>()},
    };
}

public class OrderStatusCheck {
    private int currentOrderStatus;

    public OrderStatusCheck At(int currentStatus) {
        this.currentOrderStatus = currentStatus;
        return this;
    }

    public Boolean AllowNext(int nextStatus) {
        return AllowableStatusTransition.DICTIONARY[currentOrderStatus].Contains(nextStatus);
    }
}