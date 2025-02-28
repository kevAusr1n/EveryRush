

class OrderStatusConfig {
    static readonly PENDING = 0;
    static readonly ACCEPTED = 1;
    static readonly REJECTED = 2;
    static readonly IN_DELIVERY = 3;
    static readonly FINISHED = 4;
    static readonly REFUND_REQUESTED = 5;
    static readonly REFUND_REJECTED = 6;
    static readonly REFUND_APPROVED = 7;
    static readonly REFUNDED = 8;

    static getStatusName(status: number) {
        switch (status) {
            case OrderStatusConfig.PENDING:
                return 'Pending';
            case OrderStatusConfig.ACCEPTED:
                return 'Accepted';
            case OrderStatusConfig.REJECTED:
                return 'Rejected';
            case OrderStatusConfig.IN_DELIVERY:
                return 'In Delivery';
            case OrderStatusConfig.FINISHED:
                return 'Finished';
            case OrderStatusConfig.REFUND_REQUESTED:
                return 'Refund Requested';
            case OrderStatusConfig.REFUND_REJECTED:
                return 'Refund Rejected';
            case OrderStatusConfig.REFUND_APPROVED:
                return 'Refund Approved';
            case OrderStatusConfig.REFUNDED:
                return 'Refunde';
            default:
                return 'Unknown';
        }
    }
}

export default OrderStatusConfig;