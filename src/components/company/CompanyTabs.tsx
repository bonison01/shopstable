
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanyOverviewTab } from "./CompanyOverviewTab";
import { CompanyTabContent } from "./CompanyTabContent";

interface OwnerData {
  first_name: string;
  last_name: string;
  email: string;
}

interface CompanyTabsProps {
  businessName: string;
  owner: OwnerData;
  createdAt: string;
}

export const CompanyTabs = ({ businessName, owner, createdAt }: CompanyTabsProps) => {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="customers">Customers</TabsTrigger>
        <TabsTrigger value="products">Products</TabsTrigger>
        <TabsTrigger value="orders">Orders</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <CompanyOverviewTab 
          businessName={businessName} 
          owner={owner} 
          createdAt={createdAt} 
        />
      </TabsContent>
      <TabsContent value="customers">
        <CompanyTabContent 
          title="Customer Management" 
          description="View and manage company customers" 
        />
      </TabsContent>
      <TabsContent value="products">
        <CompanyTabContent 
          title="Product Inventory" 
          description="View and manage company products" 
        />
      </TabsContent>
      <TabsContent value="orders">
        <CompanyTabContent 
          title="Order Management" 
          description="View and manage company orders" 
        />
      </TabsContent>
    </Tabs>
  );
};
