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
    productId: string;
    quantity: number;
} & Product;

export type { Product, Contact, CartItem }