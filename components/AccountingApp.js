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
    <div className="max-w-[1400px] mx-auto p-2">
      {/* Export/Import Controls - Compact */}
      <div className="mb-2">
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

      {/* Main Content */}
      <div className="space-y-2">
        {/* Journal Entry Section - Compact */}
        <Card className="p-2">
          <JournalTable
            transactions={transactions}
            setTransactions={setTransactions}
          />
        </Card>

        {/* Financial Statements - Side by Side */}
        <div className="grid grid-cols-2 gap-2">
          <Card className="p-2">
            <FinancialStatements
              transactions={transactions}
              type="balance"
            />
          </Card>
          <Card className="p-2">
            <FinancialStatements
              transactions={transactions}
              type="income"
            />
          </Card>
        </div>

        {/* Tax and Closing Accounts - Side by Side */}
        <div className="grid grid-cols-2 gap-2">
          <Card className="p-2">
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
          <Card className="p-2">
            <ClosingAccounts
              transactions={transactions}
            />
          </Card>
        </div>

        {/* Chart of Accounts - Collapsible */}
        <details className="mt-2">
          <summary className="cursor-pointer p-2 bg-gray-100 rounded-md">
            Účtová osnova
          </summary>
          <div className="mt-2">
            <ChartOfAccounts />
          </div>
        </details>
      </div>
    </div>
  );
};

export default AccountingApp;