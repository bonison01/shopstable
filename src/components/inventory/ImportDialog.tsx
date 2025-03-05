
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Import the components
import FileUploadSection from "./import/FileUploadSection";
import ColumnMappingGuide from "./import/ColumnMappingGuide";
import { processExcelData } from "@/utils/importExportUtils";

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const ImportDialog = ({ open, onOpenChange, onSuccess }: ImportDialogProps) => {
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      toast({
        variant: "destructive",
        title: "Import Failed",
        description: "Please select a file to import",
      });
      return;
    }

    await processExcelData(
      importFile,
      setIsImporting,
      onSuccess,
      onOpenChange,
      toast
    );
  };

  const resetDialog = () => {
    setImportFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) resetDialog();
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Import Inventory from Excel</DialogTitle>
          <DialogDescription>
            Upload an Excel file to import or update products. The file should contain the columns described below.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-200px)] pr-4">
          <div className="space-y-6 py-4 pr-2">
            <FileUploadSection 
              onFileChange={handleFileChange}
              selectedFile={importFile}
            />
            <ColumnMappingGuide />
          </div>
        </ScrollArea>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!importFile || isImporting}>
            {isImporting ? "Importing..." : "Import"}
            {!isImporting && <Upload className="ml-2 h-4 w-4" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportDialog;
