
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
    case 'delivered':
    case 'paid':
      return 'bg-green-500';
    case 'processing':
    case 'shipped':
    case 'pending':
      return 'bg-blue-500';
    case 'inactive':
    case 'cancelled':
      return 'bg-gray-500';
    case 'overdue':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}

export function truncateText(text: string, maxLength: number = 50): string {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

export function getInitials(name: string): string {
  if (!name) return 'U';
  
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function calculateDaysLeft(dueDate: string): number {
  if (!dueDate) return 0;
  const today = new Date();
  const due = new Date(dueDate);
  const differenceMs = due.getTime() - today.getTime();
  return Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
}

export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if the input is of correct length
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  
  return phone;
}

// Custom RPC parameters interface
export interface RPCParams {
  row_id: string;
  column_name: string;
  table_name: string;
  x?: number;
  amount?: number;
  base?: number;
}

// Functions for the DB RPC calls
export function decrement(value: number, amount: number): number {
  return Math.max(0, value - amount);
}

export function increment(value: number, amount: number = 1): number {
  return value + amount;
}

export function addAmount(value: number, amount: number): number {
  return value + amount;
}
