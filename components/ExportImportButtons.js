import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Upload } from 'lucide-react';

const ExportImportButtons = ({ 
  transactions, 
  nonTaxableRevenues, 
  isNaturalPerson,
  otherDeductionsBeforeLoss,
  taxLossFromPrevious,
  otherDeductionsAfterLoss,
  onImport 
}) => {
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importError, setImportError] = useState(null);

  // Export functionality
  const handleExport = () => {
    const exportData = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      data: {
        transactions,
        nonTaxableRevenues,
        isNaturalPerson,
        taxCalculation: {
          otherDeductionsBeforeLoss,
          taxLossFromPrevious,
          otherDeductionsAfterLoss
        }
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0,10);
    a.href = url;
    a.download = `uctovnictvo_export_${timestamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import functionality
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        // Validate imported data structure
        if (!importedData.version || !importedData.data || !importedData.data.transactions) {
          throw new Error("Neplatný formát súboru");
        }

        // Version check if needed in future
        if (importedData.version !== "1.0") {
          console.warn("Warning: Different version detected");
        }

        onImport(
          importedData.data.transactions,
          importedData.data.nonTaxableRevenues || [],
          importedData.data.isNaturalPerson || false,
          importedData.data.taxCalculation?.otherDeductionsBeforeLoss || 0,
          importedData.data.taxCalculation?.taxLossFromPrevious || 0,
          importedData.data.taxCalculation?.otherDeductionsAfterLoss || 0
        );
        setImportError(null);
        setShowImportDialog(false);
      } catch (error) {
        setImportError("Chyba pri načítaní súboru: " + error.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex space-x-2">
      <Button onClick={handleExport} className="flex items-center">
        <Download className="mr-2 h-4 w-4" />
        Exportovať údaje
      </Button>
      <Button onClick={() => setShowImportDialog(true)} variant="outline" className="flex items-center">
        <Upload className="mr-2 h-4 w-4" />
        Importovať údaje
      </Button>

      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importovať údaje</DialogTitle>
            <DialogDescription>
              Upozornenie: Import prepíše všetky existujúce údaje. Nezabudnite si exportovať aktuálne údaje, ak ich chcete zachovať.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {importError && (
              <Alert variant="destructive">
                <AlertDescription>{importError}</AlertDescription>
              </Alert>
            )}
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-primary-foreground
                hover:file:bg-primary/90"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExportImportButtons;
