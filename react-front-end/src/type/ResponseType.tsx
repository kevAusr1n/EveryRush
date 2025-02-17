import { Contact, Product } from "./EntityType";

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

export type { GetProductsResponse, GetContactsResponse };