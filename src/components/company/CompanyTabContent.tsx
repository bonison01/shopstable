
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface CompanyTabContentProps {
  title: string;
  description: string;
}

export const CompanyTabContent = ({ title, description }: CompanyTabContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{title.toLowerCase()} coming soon...</p>
      </CardContent>
    </Card>
  );
};
