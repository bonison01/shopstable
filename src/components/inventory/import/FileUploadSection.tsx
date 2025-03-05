
import React, { useState } from "react";
import { Download, Upload, FileWarning } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createSampleTemplate } from "@/utils/importExportUtils";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FileUploadSectionProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFile: File | null;
}

const FileUploadSection = ({ onFileChange, selectedFile }: FileUploadSectionProps) => {
  const { toast } = useToast();
  const [fileError, setFileError] = useState<string | null>(null);

  const handleDownloadSample = () => {
    createSampleTemplate();
    
    toast({
      title: "Sample Template Downloaded",
      description: "You can use this as a reference for formatting your import file.",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension !== 'xlsx' && fileExtension !== 'xls') {
        setFileError("Please select a valid Excel file (.xlsx or .xls)");
        return;
      }
      
      onFileChange(e);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <div className="flex-1 w-full">
          <Label htmlFor="excel-file">Excel File</Label>
          <Input 
            id="excel-file" 
            type="file" 
            accept=".xlsx,.xls"
            onChange={handleFileChange}
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
      
      {fileError && (
        <Alert variant="destructive">
          <FileWarning className="h-4 w-4 mr-2" />
          <AlertDescription>{fileError}</AlertDescription>
        </Alert>
      )}
      
      {selectedFile && (
        <div className="flex items-center text-sm text-muted-foreground">
          <Upload className="h-4 w-4 mr-2" />
          <span>Selected file: {selectedFile.name}</span>
        </div>
      )}
    </div>
  );
};

export default FileUploadSection;
