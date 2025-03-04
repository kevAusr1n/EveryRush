import { Contact, Order, Product, Review, UnreadSender } from "./ObjectType";

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

type ApiResponse = {
    result: string;
    failureDescription: string;
}

const apiExceptionFailureDescription = "API request exception";
export type { GetProductsResponse, GetContactsResponse, GetOrdersResponse, GetUnreadMessagesStatisticsResponse, GetReviewsResponse, ApiResponse };
export{ apiExceptionFailureDescription };