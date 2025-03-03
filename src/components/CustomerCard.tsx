
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { type Customer } from "@/data/mockData";
import { formatCurrency } from "@/utils/format";

interface CustomerCardProps {
  customer: Customer;
  onClick?: () => void;
}

export function CustomerCard({ customer, onClick }: CustomerCardProps) {
  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card 
      className="hover:shadow-elevation transition-all-300 hover-lift cursor-pointer animate-fade-in"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-10 w-10">
          {customer.avatarUrl ? (
            <img src={customer.avatarUrl} alt={customer.name} />
          ) : (
            <AvatarFallback>{initials}</AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium leading-none">{customer.name}</p>
            <Badge 
              variant={customer.status === "active" ? "default" : "secondary"}
              className="ml-2"
            >
              {customer.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{customer.email}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <p className="text-sm text-muted-foreground">Orders</p>
            <p className="text-lg font-medium">{customer.totalOrders}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <p className="text-lg font-medium">{formatCurrency(customer.totalSpent)}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-muted-foreground">Joined</p>
            <p className="text-base">{new Date(customer.joinDate).toLocaleDateString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
