
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OwnerData {
  first_name: string;
  last_name: string;
  email: string;
}

interface CompanyOverviewTabProps {
  businessName: string;
  owner: OwnerData;
  createdAt: string;
}

export const CompanyOverviewTab = ({ 
  businessName, 
  owner, 
  createdAt 
}: CompanyOverviewTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Business Name</p>
            <p className="text-lg">{businessName}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Owner</p>
            <p className="text-lg">{owner.first_name} {owner.last_name}</p>
            <p className="text-sm text-muted-foreground">{owner.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Company Created</p>
            <p className="text-lg">{new Date(createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
