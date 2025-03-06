
import { Building2 } from "lucide-react";

interface CompanyHeaderProps {
  businessName: string;
}

export const CompanyHeader = ({ businessName }: CompanyHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2">
        <Building2 className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">{businessName}</h1>
      </div>
      <p className="text-muted-foreground mt-1">
        Company dashboard and statistics
      </p>
    </div>
  );
};
