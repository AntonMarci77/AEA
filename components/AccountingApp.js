import React, { useState, useEffect } from 'react';
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto p-4">
        {/* Export/Import - Small and Compact */}
        <div className="flex justify-end mb-2">
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

        <div className="space-y-4">
          {/* Journal Section - Compact */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Účtovný denník</h2>
              <JournalTable
                transactions={transactions}
                setTransactions={setTransactions}
              />
            </div>
          </div>

          {/* Financial Statements - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Súvaha</h2>
              <FinancialStatements
                transactions={transactions}
                type="balance"
              />
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Výkaz ziskov a strát</h2>
              <FinancialStatements
                transactions={transactions}
                type="income"
              />
            </div>
          </div>

          {/* Tax and Closing Accounts - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Výpočet dane</h2>
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
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Uzávierkové účty</h2>
              <ClosingAccounts
                transactions={transactions}
              />
            </div>
          </div>

          {/* Chart of Accounts - Collapsible */}
          <details className="bg-white shadow rounded-lg">
            <summary className="p-4 cursor-pointer font-semibold hover:bg-gray-50">
              Účtová osnova
            </summary>
            <div className="p-4 border-t">
              <ChartOfAccounts />
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default AccountingApp;