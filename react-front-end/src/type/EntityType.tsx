type Product = {
    id: string;
    userId: string;
    userName: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    status: number;
    imageUrl: string;
    createdAt: Date
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
    fromOrderStatus: number;
    toOrderStatus: number;
    createdAt: Date,
    event: string;
    comment: string;
}

type Order = {
    id: string;
    buyerId: string;
    buyerName: string;
    sellerId: string;
    sellerName: string;
    status: number;
    purchaseProducts: CartItem[];
    orderProcesses: OrderProcess[];
    fullName: string;
    email: string;
    phone: string;
    address: string;
    totalPrice: number;
}

type ChatMessage = {
    id: string;
    fromUserId: string;
    toUserId: string;
    content: string;
    createdAt: Date;
}

export type { Product, Contact, CartItem, Order, OrderProcess, ChatMessage }