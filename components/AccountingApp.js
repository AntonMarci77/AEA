import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import JournalTable from './JournalTable';
import FinancialStatements from './FinancialStatements';
import TaxCalculation from './TaxCalculation';
import ClosingAccounts from './ClosingAccounts';
import ChartOfAccounts from './ChartOfAccounts';
import ExportImportButtons from './ExportImportButtons';

const AccountingApp = () => {
  const [transactions, setTransactions] = useState([]);
  const [nonTaxableRevenues, setNonTaxableRevenues] = useState([]);
  const [isNaturalPerson, setIsNaturalPerson] = useState(false);
  const [otherDeductionsBeforeLoss, setOtherDeductionsBeforeLoss] = useState(0);
  const [taxLossFromPrevious, setTaxLossFromPrevious] = useState(0);
  const [otherDeductionsAfterLoss, setOtherDeductionsAfterLoss] = useState(0);

  const handleImport = (
    importedTransactions,
    importedNonTaxableRevenues,
    importedIsNaturalPerson,
    importedOtherDeductionsBeforeLoss,
    importedTaxLossFromPrevious,
    importedOtherDeductionsAfterLoss
  ) => {
    setTransactions(importedTransactions);
    setNonTaxableRevenues(importedNonTaxableRevenues);
    setIsNaturalPerson(importedIsNaturalPerson);
    setOtherDeductionsBeforeLoss(importedOtherDeductionsBeforeLoss);
    setTaxLossFromPrevious(importedTaxLossFromPrevious);
    setOtherDeductionsAfterLoss(importedOtherDeductionsAfterLoss);
  };

  return (
    <div className="container mx-auto px-2 py-4 max-w-[1600px]">
      {/* Top Controls */}
      <div className="mb-4 flex justify-end">
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

      {/* Main Content Layout */}
      <div className="space-y-4">
        {/* Journal Section */}
        <Card className="p-4">
          <JournalTable
            transactions={transactions}
            setTransactions={setTransactions}
          />
        </Card>

        {/* Financial Statements Section */}
        <div className="grid grid-cols-2 gap-4">
          {/* Balance Sheet */}
          <Card className="p-4">
            <div className="text-lg font-bold mb-4">Súvaha</div>
            <FinancialStatements
              transactions={transactions}
              type="balance"
            />
          </Card>

          {/* Income Statement */}
          <Card className="p-4">
            <div className="text-lg font-bold mb-4">Výkaz ziskov a strát</div>
            <FinancialStatements
              transactions={transactions}
              type="income"
            />
          </Card>
        </div>

        {/* Tax and Closing Accounts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Tax Calculation */}
          <Card className="p-4">
            <div className="text-lg font-bold mb-4">Výpočet dane</div>
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
          </Card>

          {/* Closing Accounts */}
          <Card className="p-4">
            <div className="text-lg font-bold mb-4">Uzávierkové účty</div>
            <ClosingAccounts
              transactions={transactions}
            />
          </Card>
        </div>

        {/* Chart of Accounts - Collapsible */}
        <details className="border rounded-lg p-4 mt-4">
          <summary className="text-lg font-bold cursor-pointer">
            Účtová osnova
          </summary>
          <div className="mt-4">
            <ChartOfAccounts />
          </div>
        </details>
      </div>

      {/* Feedback for Balance Check */}
      {transactions.length > 0 && balanceError && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg">
          Súvaha nie je vyrovnaná (Aktíva ≠ Pasíva)
        </div>
      )}
    </div>
  );
};

export default AccountingApp;