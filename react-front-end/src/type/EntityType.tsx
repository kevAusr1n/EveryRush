type ProductEntity = {
    id: string;
    userId: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
}

type ContactType = {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    address: string;
    city: string;
    state: string;
    postcode: string;
}

type CartItemType = {
    id: string;
    userId: string;
    productId: string;
    quantity: number;
}
export type { ProductEntity, ContactType, CartItemType }