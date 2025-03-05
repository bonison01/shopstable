
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth/useAuth";

interface TransactionFormProps {
  onTransactionAdded: () => void;
}

export const TransactionForm = ({ onTransactionAdded }: TransactionFormProps) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const { toast } = useToast();
  const { user } = useAuth();

  const handleAddTransaction = async () => {
    if (!description || !amount || !user) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide both description and amount",
      });
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid positive number",
      });
      return;
    }

    const { data, error } = await supabase
      .from('cash_transactions')
      .insert([
        { 
          description,
          amount: amountValue,
          type,
          created_at: new Date().toISOString(),
          user_id: user.id
        }
      ]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error adding transaction",
        description: error.message,
      });
      return;
    }

    toast({
      title: "Transaction added",
      description: "The transaction has been recorded successfully",
    });

    // Reset form
    setDescription("");
    setAmount("");
    
    // Notify parent component
    onTransactionAdded();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Transaction</CardTitle>
        <CardDescription>Record a new income or expense</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Tabs defaultValue="income" value={type} onValueChange={setType}>
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="income">Income</TabsTrigger>
                <TabsTrigger value="expense">Expense</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter transaction description"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                className="pl-10"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleAddTransaction}
        >
          {type === 'income' ? 'Add Income' : 'Add Expense'}
        </Button>
      </CardFooter>
    </Card>
  );
};
