import { Contact, Order, Product } from "./EntityType";

type GetProductsResponse = {
    products: Product[];
    totalPages: number;
    totalCount: number;
}

type GetContactsResponse = {
    contacts: Contact[];
    totalPages: number;
    totalCount: number;
}

type GetOrdersResponse = {
    orders: Order[];
    totalPages: number;
    totalCount: number;
}

type GetUnreadMessagesStatisticsResponse = {
    totalPages: number;
    totalCount: number;
    unreadSenders: UnreadSender[]
}

type GetReviewsResponse = {
    totalPages: number;
    totalCount: number;
    reviews: Review[]
}

type UnreadSender = {
    senderId: string;
    senderName: string;
    unreadCount: number;
}

type Review = {
    id: string
    productId: string;
    orderId: string;
    reviewerId: string;
    reviewerName: string;
    replyToId: string;
    replierId: string;
    replierName: string;
    type: number;
    rating: number;
    content: string;
    createdAt: string;
}

export type { GetProductsResponse, GetContactsResponse, GetOrdersResponse, GetUnreadMessagesStatisticsResponse, GetReviewsResponse };