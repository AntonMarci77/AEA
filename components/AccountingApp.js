import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
    <div className="container mx-auto p-4">
      {/* Top Section: Export/Import */}
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Journal Section - Full Width */}
        <div className="col-span-12">
          <JournalTable
            transactions={transactions}
            setTransactions={setTransactions}
          />
        </div>

        {/* Financial Statements Section - Side by Side */}
        <div className="col-span-6">
          <Card>
            <CardHeader>
              <CardTitle>Súvaha</CardTitle>
            </CardHeader>
            <CardContent>
              <FinancialStatements
                transactions={transactions}
                type="balance"
              />
            </CardContent>
          </Card>
        </div>

        <div className="col-span-6">
          <Card>
            <CardHeader>
              <CardTitle>Výkaz ziskov a strát</CardTitle>
            </CardHeader>
            <CardContent>
              <FinancialStatements
                transactions={transactions}
                type="income"
              />
            </CardContent>
          </Card>
        </div>

        {/* Tax Calculation Section */}
        <div className="col-span-12">
          <Card>
            <CardHeader>
              <CardTitle>Daňové priznanie</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </div>

        {/* Closing Accounts */}
        <div className="col-span-12">
          <Card>
            <CardHeader>
              <CardTitle>Uzávierkové účty</CardTitle>
            </CardHeader>
            <CardContent>
              <ClosingAccounts
                transactions={transactions}
              />
            </CardContent>
          </Card>
        </div>

        {/* Chart of Accounts - Hidden by Default */}
        <div className="col-span-12 mt-8">
          <details>
            <summary className="cursor-pointer font-bold text-lg mb-4">
              Účtová osnova
            </summary>
            <ChartOfAccounts />
          </details>
        </div>
      </div>
    </div>
  );
};

export default AccountingApp;