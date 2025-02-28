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


export type { GetProductsResponse, GetContactsResponse, GetOrdersResponse };