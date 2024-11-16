import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const FinancialStatements = ({ transactions, type }) => {
  const [balanceSheet, setBalanceSheet] = useState({
    assets: {
      nonCurrent: {},
      current: {},
      contraAccounts: {}
    },
    equityAndLiabilities: {
      equity: {},
      nonCurrentLiabilities: {},
      currentLiabilities: {},
      profitLoss: 0
    }
  });

  const [incomeStatement, setIncomeStatement] = useState({
    expenses: {},
    revenues: {},
    profitLoss: 0
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('sk-SK', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  useEffect(() => {
    calculateStatements();
  }, [transactions]);

  const calculateStatements = () => {
    const newBalanceSheet = {
      assets: { nonCurrent: {}, current: {}, contraAccounts: {} },
      equityAndLiabilities: {
        equity: {},
        nonCurrentLiabilities: {},
        currentLiabilities: {},
        profitLoss: 0
      }
    };

    const newIncomeStatement = {
      expenses: {},
      revenues: {},
      profitLoss: 0
    };

    transactions.forEach(transaction => {
      const amount = parseFloat(transaction.amount) || 0;
      
      // Process debit entries
      if (transaction.debitAccount) {
        const account = transaction.debitAccount;
        const groupNum = account.substring(0, 2);

        // Handle assets
        if (account.startsWith('0') || 
            account.startsWith('1') || 
            account.startsWith('2') ||
            groupNum === '31' ||
            groupNum === '35') {
          if (account.startsWith('0')) {
            newBalanceSheet.assets.nonCurrent[groupNum] = 
              (newBalanceSheet.assets.nonCurrent[groupNum] || 0) + amount;
          } else {
            newBalanceSheet.assets.current[groupNum] = 
              (newBalanceSheet.assets.current[groupNum] || 0) + amount;
          }
        }
        
        // Handle expenses
        if (account.startsWith('5')) {
          newIncomeStatement.expenses[groupNum] = 
            (newIncomeStatement.expenses[groupNum] || 0) + amount;
        }
      }

      // Process credit entries
      if (transaction.creditAccount) {
        const account = transaction.creditAccount;
        const groupNum = account.substring(0, 2);

        // Handle liabilities and equity
        if (account.startsWith('4')) {
          if (groupNum.startsWith('45') || groupNum.startsWith('46') || groupNum.startsWith('47')) {
            newBalanceSheet.equityAndLiabilities.nonCurrentLiabilities[groupNum] = 
              (newBalanceSheet.equityAndLiabilities.nonCurrentLiabilities[groupNum] || 0) + amount;
          } else {
            newBalanceSheet.equityAndLiabilities.equity[groupNum] = 
              (newBalanceSheet.equityAndLiabilities.equity[groupNum] || 0) + amount;
          }
        }

        // Handle revenues
        if (account.startsWith('6')) {
          newIncomeStatement.revenues[groupNum] = 
            (newIncomeStatement.revenues[groupNum] || 0) + amount;
        }
      }
    });

    // Calculate profit/loss
    const totalRevenues = Object.values(newIncomeStatement.revenues).reduce((sum, val) => sum + val, 0);
    const totalExpenses = Object.values(newIncomeStatement.expenses).reduce((sum, val) => sum + val, 0);
    newIncomeStatement.profitLoss = totalRevenues - totalExpenses;

    // Add profit/loss to balance sheet
    newBalanceSheet.equityAndLiabilities.profitLoss = newIncomeStatement.profitLoss;

    setBalanceSheet(newBalanceSheet);
    setIncomeStatement(newIncomeStatement);
  };

  if (type === 'balance') {
    return (
      <div className="grid grid-cols-2 gap-4">
        {/* Assets Side */}
        <div>
          <h3 className="font-bold mb-2">Aktíva</h3>
          
          {/* Non-current Assets */}
          <div className="mb-4">
            <h4 className="font-semibold text-sm">Neobežný majetok</h4>
            {Object.entries(balanceSheet.assets.nonCurrent).map(([group, amount]) => (
              <div key={group} className="flex justify-between text-sm">
                <span>{group}</span>
                <span>{formatCurrency(amount)}</span>
              </div>
            ))}
          </div>

          {/* Current Assets */}
          <div className="mb-4">
            <h4 className="font-semibold text-sm">Obežný majetok</h4>
            {Object.entries(balanceSheet.assets.current).map(([group, amount]) => (
              <div key={group} className="flex justify-between text-sm">
                <span>{group}</span>
                <span>{formatCurrency(amount)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Equity and Liabilities Side */}
        <div>
          <h3 className="font-bold mb-2">Pasíva</h3>
          
          {/* Equity */}
          <div className="mb-4">
            <h4 className="font-semibold text-sm">Vlastné imanie</h4>
            {Object.entries(balanceSheet.equityAndLiabilities.equity).map(([group, amount]) => (
              <div key={group} className="flex justify-between text-sm">
                <span>{group}</span>
                <span>{formatCurrency(amount)}</span>
              </div>
            ))}
            {balanceSheet.equityAndLiabilities.profitLoss !== 0 && (
              <div className="flex justify-between text-sm font-semibold">
                <span>Výsledok hospodárenia</span>
                <span className={balanceSheet.equityAndLiabilities.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(balanceSheet.equityAndLiabilities.profitLoss)}
                </span>
              </div>
            )}
          </div>

          {/* Liabilities */}
          <div>
            <h4 className="font-semibold text-sm">Záväzky</h4>
            {Object.entries(balanceSheet.equityAndLiabilities.nonCurrentLiabilities).map(([group, amount]) => (
              <div key={group} className="flex justify-between text-sm">
                <span>{group}</span>
                <span>{formatCurrency(amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Income Statement
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Expenses Side */}
      <div>
        <h3 className="font-bold mb-2">Náklady</h3>
        {Object.entries(incomeStatement.expenses).map(([group, amount]) => (
          <div key={group} className="flex justify-between text-sm">
            <span>{group}</span>
            <span>{formatCurrency(amount)}</span>
          </div>
        ))}
      </div>

      {/* Revenues Side */}
      <div>
        <h3 className="font-bold mb-2">Výnosy</h3>
        {Object.entries(incomeStatement.revenues).map(([group, amount]) => (
          <div key={group} className="flex justify-between text-sm">
            <span>{group}</span>
            <span>{formatCurrency(amount)}</span>
          </div>
        ))}
        
        {/* Profit/Loss */}
        <div className="mt-4 pt-2 border-t">
          <div className="flex justify-between font-semibold">
            <span>Výsledok hospodárenia</span>
            <span className={incomeStatement.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}>
              {formatCurrency(incomeStatement.profitLoss)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialStatements;