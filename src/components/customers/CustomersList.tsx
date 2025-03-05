
import { useState } from "react";
import { Customer } from "@/pages/Customers";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";

interface CustomersListProps {
  customers: Customer[] | undefined;
  isLoading: boolean;
  selectedCustomers: string[];
  toggleCustomerSelection: (customerId: string) => void;
  toggleSelectAll: () => void;
  openCustomerDetails: (customerId: string) => void;
  setSelectedCustomers: React.Dispatch<React.SetStateAction<string[]>>;
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CustomersList = ({
  customers,
  isLoading,
  selectedCustomers,
  toggleCustomerSelection,
  toggleSelectAll,
  openCustomerDetails,
  setSelectedCustomers,
  setIsDeleteDialogOpen,
}: CustomersListProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={
                  customers?.length > 0 &&
                  selectedCustomers.length === customers?.length
                }
                onCheckedChange={toggleSelectAll}
                aria-label="Select all customers"
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="hidden md:table-cell">Phone</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="hidden md:table-cell">Orders</TableHead>
            <TableHead className="text-right">Total Spent</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                Loading customers...
              </TableCell>
            </TableRow>
          ) : customers?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                No customers found
              </TableCell>
            </TableRow>
          ) : (
            customers?.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedCustomers.includes(customer.id)}
                    onCheckedChange={() => toggleCustomerSelection(customer.id)}
                    aria-label={`Select ${customer.name}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell className="hidden md:table-cell">{customer.phone}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge
                    variant={customer.status === "active" ? "success" : "destructive"}
                  >
                    {customer.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{customer.total_orders}</TableCell>
                <TableCell className="text-right">
                  ${customer.total_spent?.toFixed(2)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openCustomerDetails(customer.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openCustomerDetails(customer.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit customer
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => {
                          setSelectedCustomers([customer.id]);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete customer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
