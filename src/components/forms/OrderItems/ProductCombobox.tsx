import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils"; // Utility for className merging

import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format";
import { Product } from "@/hooks/use-order-form";

interface ProductComboboxProps {
    value: string;
    onChange: (value: string) => void;
    products: Product[];
    productsLoading: boolean;
}

export const ProductCombobox = ({
    value,
    onChange,
    products,
    productsLoading,
}: ProductComboboxProps) => {
    const [open, setOpen] = useState(false);
    const selectedProduct = products.find((p) => p.id === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={productsLoading}
                >
                    {selectedProduct ? `${selectedProduct.name}` : "Select product"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search product..." />
                    <CommandEmpty>No product found.</CommandEmpty>
                    <CommandList>
                        {products.map((product) => (
                            <CommandItem
                                key={product.id}
                                value={product.name}
                                onSelect={() => {
                                    onChange(product.id);
                                    setOpen(false);
                                }}
                                disabled={product.stock <= 0}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === product.id ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {product.name} - {formatCurrency(product.price)}{" "}
                                {product.stock <= 0
                                    ? "(Out of stock)"
                                    : `(${product.stock} in stock)`}
                            </CommandItem>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
