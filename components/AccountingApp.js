import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import JournalTable from './JournalTable';
import FinancialStatements from './FinancialStatements';
import TaxCalculation from './TaxCalculation';
import ClosingAccounts from './ClosingAccounts';
import ChartOfAccounts from './ChartOfAccounts';
import ExportImportButtons from './ExportImportButtons';

const AccountingApp = () => {
  // State management remains the same
  const [transactions, setTransactions] = useState([]);
  const [nonTaxableRevenues, setNonTaxableRevenues] = useState([]);
  const [isNaturalPerson, setIsNaturalPerson] = useState(false);
  const [otherDeductionsBeforeLoss, setOtherDeductionsBeforeLoss] = useState(0);
  const [taxLossFromPrevious, setTaxLossFromPrevious] = useState(0);
  const [otherDeductionsAfterLoss, setOtherDeductionsAfterLoss] = useState(0);

  const handleImport = (/*...same parameters...*/) => {
    // Import handling remains the same
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Export/Import Controls */}
      <div className="mb-4">
        <ExportImportButtons
          transactions={transactions}
          nonTaxableRevenues={nonTaxableRevenues}
          isNaturalPerson={isNaturalPerson}
          otherDeductionsBeforeLoss={otherDeductionsBeforeLoss}
          taxLossFromPrevious={taxLossFromPrevious}
          otherDeductionsAfterLoss={otherDeductionsAfterLoss}
          onImport={handleImport}
        />
      </div>

      <Tabs defaultValue="journal" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="journal">Účtovný denník</TabsTrigger>
          <TabsTrigger value="statements">Účtovná závierka</TabsTrigger>
          <TabsTrigger value="tax">Daňové priznanie</TabsTrigger>
          <TabsTrigger value="accounts">Účtová osnova</TabsTrigger>
        </TabsList>

        {/* Journal Tab */}
        <TabsContent value="journal" className="space-y-4">
          <JournalTable
            transactions={transactions}
            setTransactions={setTransactions}
          />
        </TabsContent>

        {/* Financial Statements Tab */}
        <TabsContent value="statements" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Účtovná závierka</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Balance Sheet */}
                <div className="grid grid-cols-2 gap-4">
                  <FinancialStatements 
                    transactions={transactions}
                    view="balance"
                  />
                </div>
                {/* Income Statement */}
                <div className="grid grid-cols-2 gap-4">
                  <FinancialStatements 
                    transactions={transactions}
                    view="income"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tax Tab */}
        <TabsContent value="tax" className="space-y-4">
          <TaxCalculation
            transactions={transactions}
            nonTaxableRevenues={nonTaxableRevenues}
            setNonTaxableRevenues={setNonTaxableRevenues}
            isNaturalPerson={isNaturalPerson}
            setIsNaturalPerson={setIsNaturalPerson}
            otherDeductionsBeforeLoss={otherDeductionsBeforeLoss}
            setOtherDeductionsBeforeLoss={setOtherDeductionsBeforeLoss}
            taxLossFromPrevious={taxLossFromPrevious}
            setTaxLossFromPrevious={setTaxLossFromPrevious}
            otherDeductionsAfterLoss={otherDeductionsAfterLoss}
            setOtherDeductionsAfterLoss={setOtherDeductionsAfterLoss}
          />
        </TabsContent>

        {/* Accounts Tab */}
        <TabsContent value="accounts" className="space-y-4">
          <ChartOfAccounts />
        </TabsContent>
      </Tabs>

      {/* Closing Accounts Below Tabs */}
      <div className="mt-8">
        <ClosingAccounts
          transactions={transactions}
        />
      </div>
    </div>
  );
};

export default AccountingApp;