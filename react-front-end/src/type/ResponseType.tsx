import { Contact, Order, Product, Review, UnreadSender } from "./EntityType";

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

export type { GetProductsResponse, GetContactsResponse, GetOrdersResponse, GetUnreadMessagesStatisticsResponse, GetReviewsResponse };