import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import JournalTable from './JournalTable';
import FinancialStatements from './FinancialStatements';
import TaxCalculation from './TaxCalculation';
import ClosingAccounts from './ClosingAccounts';
import ChartOfAccounts from './ChartOfAccounts';
import ExportImportButtons from './ExportImportButtons';

const AccountingApp = () => {
  // State for all application data
  const [transactions, setTransactions] = useState([]);
  const [nonTaxableRevenues, setNonTaxableRevenues] = useState([]);
  const [isNaturalPerson, setIsNaturalPerson] = useState(false);
  const [otherDeductionsBeforeLoss, setOtherDeductionsBeforeLoss] = useState(0);
  const [taxLossFromPrevious, setTaxLossFromPrevious] = useState(0);
  const [otherDeductionsAfterLoss, setOtherDeductionsAfterLoss] = useState(0);

  // Handle import of data
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
    <div className="container mx-auto p-4 space-y-6">
      {/* Export/Import Controls */}
      <div className="mb-6">
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

      {/* Journal Section */}
      <JournalTable
        transactions={transactions}
        setTransactions={setTransactions}
      />

      {/* Financial Statements Section */}
      <FinancialStatements
        transactions={transactions}
      />

      {/* Tax Calculation Section */}
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

      {/* Closing Accounts Section */}
      <ClosingAccounts
        transactions={transactions}
      />

      {/* Chart of Accounts Section */}
      <ChartOfAccounts />
    </div>
  );
};

export default AccountingApp;
