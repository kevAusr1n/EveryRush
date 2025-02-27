type Product = {
    id: string;
    userId: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    status: number;
    imageUrl: string;
    createAt: Date
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
    sellerId: string;
    sellerName: string;
    productId: string;
    quantity: number;
} & Product;

type OrderProcess = {
    id: string;
    orderId: string;
    fromStatus: number;
    toStatus: number;
    createAt: Date,
    fromUserId: string;
    fromUserName: string;
    toUserName: string;
    event: string;
    comment: string;
}

type Order = {
    id: string;
    userId: string;
    sellerName: string;
    status: number;
    cartItems: CartItem[];
    orderProcesses: OrderProcess[];
    fullName: string;
    email: string;
    phone: string;
    address: string;
    totalPrice: number;
}

export type { Product, Contact, CartItem, Order, OrderProcess }