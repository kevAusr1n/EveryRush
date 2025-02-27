using System.Reflection.Metadata;

public class OrderStatus {
    public static int currentOrderStatus;
    public static readonly int PENDING = 0;
    public static int ACCEPTED = 1;
    public static int REJECTED = 2;
    public static int IN_DELIVERY = 3;
    public static int FINISHED = 4;
    public static int REFUND_REQUESTED = 5;
    public static int REFUND_REJECTED = 6;
    public static int REFUND_ARROVED = 7;
    public static int REFUNDED = 8;

    public void At(int currentStatus) {
        currentOrderStatus = currentStatus;
    }

    public Boolean Next(int nextStatus) {
        return AllowableOrderStatusTransition.DICTIONARY[currentOrderStatus].Contains(nextStatus);
    }
}

public class AllowableOrderStatusTransition {
    public static readonly Dictionary<int, List<int>> DICTIONARY = new Dictionary<int, List<int>> {
        {OrderStatus.PENDING, new List<int> {OrderStatus.ACCEPTED, OrderStatus.REJECTED, OrderStatus.REFUND_REQUESTED}},
        {OrderStatus.ACCEPTED, new List<int> {OrderStatus.REFUND_REQUESTED, OrderStatus.IN_DELIVERY}},
        {OrderStatus.REFUND_REQUESTED, new List<int> {OrderStatus.REFUND_REJECTED, OrderStatus.REFUND_ARROVED}},
        {OrderStatus.IN_DELIVERY, new List<int> {OrderStatus.REFUND_REQUESTED}},
        {OrderStatus.FINISHED, new List<int> {OrderStatus.REFUND_REQUESTED}},
        {OrderStatus.REJECTED, new List<int>()},
        {OrderStatus.REFUND_REJECTED, new List<int>()},
        {OrderStatus.REFUND_ARROVED, new List<int>(OrderStatus.REFUNDED)},
        {OrderStatus.REFUNDED, new List<int>()},
    };
}