type Product = {
    id: string;
    userId: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
}

type Contact = {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postcode: string;
}

type CartItem = {
    id: string;
    userId: string;
    productId: string;
    quantity: number;
}
export type { Product, Contact, CartItem }