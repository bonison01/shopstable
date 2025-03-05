
import React from "react";
import { Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createSampleTemplate } from "@/utils/importExportUtils";

interface FileUploadSectionProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadSection = ({ onFileChange }: FileUploadSectionProps) => {
  const { toast } = useToast();

  const handleDownloadSample = () => {
    createSampleTemplate();
    
    toast({
      title: "Sample Template Downloaded",
      description: "You can use this as a reference for formatting your import file.",
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
      <div className="flex-1 w-full">
        <Label htmlFor="excel-file">Excel File</Label>
        <Input 
          id="excel-file" 
          type="file" 
          accept=".xlsx,.xls"
          onChange={onFileChange}
        />
      </div>
      <Button 
        variant="outline" 
        onClick={handleDownloadSample}
        className="mt-6 whitespace-nowrap"
      >
        <Download className="h-4 w-4 mr-2" />
        Download Sample
      </Button>
    </div>
  );
};

export default FileUploadSection;
