
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive';
  avatarUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  threshold: number;
  sku: string;
  imageUrl?: string;
  description: string;
  lastUpdated: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  paymentStatus: 'paid' | 'pending' | 'overdue';
  paymentDueDate?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export const customers: Customer[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St, City, State',
    joinDate: '2023-01-15',
    totalOrders: 12,
    totalSpent: 1450.99,
    status: 'active',
  },
  {
    id: '2',
    name: 'Sam Williams',
    email: 'sam@example.com',
    phone: '(555) 234-5678',
    address: '456 Oak Rd, Town, State',
    joinDate: '2023-02-20',
    totalOrders: 5,
    totalSpent: 780.50,
    status: 'active',
  },
  {
    id: '3',
    name: 'Taylor Davis',
    email: 'taylor@example.com',
    phone: '(555) 345-6789',
    address: '789 Pine Ln, Village, State',
    joinDate: '2023-03-10',
    totalOrders: 8,
    totalSpent: 1200.75,
    status: 'inactive',
  },
  {
    id: '4',
    name: 'Morgan Brown',
    email: 'morgan@example.com',
    phone: '(555) 456-7890',
    address: '101 Cedar Blvd, County, State',
    joinDate: '2023-04-05',
    totalOrders: 3,
    totalSpent: 350.25,
    status: 'active',
  },
  {
    id: '5',
    name: 'Jordan Smith',
    email: 'jordan@example.com',
    phone: '(555) 567-8901',
    address: '202 Elm St, District, State',
    joinDate: '2023-05-18',
    totalOrders: 10,
    totalSpent: 1550.00,
    status: 'active',
  }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Premium Headphones',
    category: 'Electronics',
    price: 199.99,
    stock: 25,
    threshold: 5,
    sku: 'ELEC-HD-001',
    description: 'High-quality wireless headphones with noise cancellation.',
    lastUpdated: '2023-06-10',
  },
  {
    id: '2',
    name: 'Ergonomic Keyboard',
    category: 'Accessories',
    price: 89.99,
    stock: 40,
    threshold: 10,
    sku: 'ACC-KB-002',
    description: 'Comfortable keyboard with ergonomic design for long typing sessions.',
    lastUpdated: '2023-05-25',
  },
  {
    id: '3',
    name: 'Wireless Mouse',
    category: 'Accessories',
    price: 49.99,
    stock: 3,
    threshold: 5,
    sku: 'ACC-MS-003',
    description: 'Precision wireless mouse with long battery life.',
    lastUpdated: '2023-06-15',
  },
  {
    id: '4',
    name: 'Ultra HD Monitor',
    category: 'Electronics',
    price: 349.99,
    stock: 12,
    threshold: 3,
    sku: 'ELEC-MN-004',
    description: '27-inch 4K monitor with HDR support.',
    lastUpdated: '2023-07-01',
  },
  {
    id: '5',
    name: 'Laptop Stand',
    category: 'Accessories',
    price: 29.99,
    stock: 50,
    threshold: 10,
    sku: 'ACC-LS-005',
    description: 'Adjustable laptop stand for improved ergonomics.',
    lastUpdated: '2023-05-18',
  }
];

export const orders: Order[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'Alex Johnson',
    date: '2023-06-28',
    status: 'delivered',
    total: 249.98,
    items: [
      { productId: '1', productName: 'Premium Headphones', quantity: 1, price: 199.99, subtotal: 199.99 },
      { productId: '5', productName: 'Laptop Stand', quantity: 1, price: 29.99, subtotal: 29.99 }
    ],
    paymentStatus: 'paid',
  },
  {
    id: '2',
    customerId: '2',
    customerName: 'Sam Williams',
    date: '2023-07-03',
    status: 'shipped',
    total: 89.99,
    items: [
      { productId: '2', productName: 'Ergonomic Keyboard', quantity: 1, price: 89.99, subtotal: 89.99 }
    ],
    paymentStatus: 'paid',
  },
  {
    id: '3',
    customerId: '3',
    customerName: 'Taylor Davis',
    date: '2023-07-05',
    status: 'processing',
    total: 399.98,
    items: [
      { productId: '4', productName: 'Ultra HD Monitor', quantity: 1, price: 349.99, subtotal: 349.99 },
      { productId: '5', productName: 'Laptop Stand', quantity: 1, price: 29.99, subtotal: 29.99 }
    ],
    paymentStatus: 'pending',
    paymentDueDate: '2023-07-19',
  },
  {
    id: '4',
    customerId: '4',
    customerName: 'Morgan Brown',
    date: '2023-07-10',
    status: 'pending',
    total: 49.99,
    items: [
      { productId: '3', productName: 'Wireless Mouse', quantity: 1, price: 49.99, subtotal: 49.99 }
    ],
    paymentStatus: 'pending',
    paymentDueDate: '2023-07-24',
  },
  {
    id: '5',
    customerId: '5',
    customerName: 'Jordan Smith',
    date: '2023-06-25',
    status: 'delivered',
    total: 599.96,
    items: [
      { productId: '1', productName: 'Premium Headphones', quantity: 1, price: 199.99, subtotal: 199.99 },
      { productId: '2', productName: 'Ergonomic Keyboard', quantity: 1, price: 89.99, subtotal: 89.99 },
      { productId: '3', productName: 'Wireless Mouse', quantity: 1, price: 49.99, subtotal: 49.99 },
      { productId: '4', productName: 'Ultra HD Monitor', quantity: 1, price: 349.99, subtotal: 349.99 },
    ],
    paymentStatus: 'overdue',
    paymentDueDate: '2023-07-09',
  }
];

export const salesData = [
  { month: 'Jan', sales: 4000 },
  { month: 'Feb', sales: 3000 },
  { month: 'Mar', sales: 5000 },
  { month: 'Apr', sales: 4500 },
  { month: 'May', sales: 6000 },
  { month: 'Jun', sales: 5500 },
  { month: 'Jul', sales: 7000 },
];

export const topProducts = [
  { name: 'Premium Headphones', sales: 150, percentage: 30 },
  { name: 'Ultra HD Monitor', sales: 120, percentage: 24 },
  { name: 'Ergonomic Keyboard', sales: 100, percentage: 20 },
  { name: 'Wireless Mouse', sales: 80, percentage: 16 },
  { name: 'Laptop Stand', sales: 50, percentage: 10 },
];

export const statsSummary = {
  totalCustomers: 145,
  activeCustomers: 120,
  totalProducts: 52,
  lowStockProducts: 8,
  totalOrders: 315,
  pendingOrders: 24,
  totalRevenue: 45890.75,
  averageOrderValue: 145.68,
};

export const recentActivity = [
  { id: 1, type: 'new_order', message: 'New order #1234 from Alex Johnson', time: '10 minutes ago' },
  { id: 2, type: 'payment', message: 'Payment received for order #1230', time: '1 hour ago' },
  { id: 3, type: 'stock_alert', message: 'Wireless Mouse stock is low (3 remaining)', time: '2 hours ago' },
  { id: 4, type: 'new_customer', message: 'New customer registered: Pat Wilson', time: '3 hours ago' },
  { id: 5, type: 'shipped', message: 'Order #1229 has been shipped', time: '5 hours ago' },
];
