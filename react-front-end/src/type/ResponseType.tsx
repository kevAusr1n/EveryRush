import { Product } from "./EntityType";

type GetProductsResponse = {
    products: Product[];
    totalPages: number;
    totalCount: number;
}

export type { GetProductsResponse };