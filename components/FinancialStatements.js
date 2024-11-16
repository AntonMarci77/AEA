import React, { useState, useEffect } from 'react';

const FinancialStatements = ({ transactions, type }) => {
  // Initialize state with proper structure
  const [statements, setStatements] = useState({
    balance: {
      assets: {
        nonCurrent: {},
        current: {},
        total: 0
      },
      equityAndLiabilities: {
        equity: {},
        liabilities: {},
        total: 0
      },
      profitLoss: 0
    },
    income: {
      expenses: {},
      revenues: {},
      profitLoss: 0
    }
  });

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('sk-SK', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  // Calculate statements
  useEffect(() => {
    const newStatements = {
      balance: {
        assets: { nonCurrent: {}, current: {}, total: 0 },
        equityAndLiabilities: { equity: {}, liabilities: {}, total: 0 },
        profitLoss: 0
      },
      income: { expenses: {}, revenues: {}, profitLoss: 0 }
    };

    transactions.forEach(transaction => {
      const amount = parseFloat(transaction.amount) || 0;

      // Process debit side
      if (transaction.debitAccount) {
        const account = transaction.debitAccount;
        const groupNum = account.substring(0, 2);

        if (account.startsWith('0')) {
          newStatements.balance.assets.nonCurrent[groupNum] = 
            (newStatements.balance.assets.nonCurrent[groupNum] || 0) + amount;
        } else if (account.startsWith('1') || account.startsWith('2') || 
                   groupNum === '31' || groupNum === '35') {
          newStatements.balance.assets.current[groupNum] = 
            (newStatements.balance.assets.current[groupNum] || 0) + amount;
        } else if (account.startsWith('5')) {
          newStatements.income.expenses[groupNum] = 
            (newStatements.income.expenses[groupNum] || 0) + amount;
        }
      }

      // Process credit side
      if (transaction.creditAccount) {
        const account = transaction.creditAccount;
        const groupNum = account.substring(0, 2);

        if (account.startsWith('4')) {
          if (groupNum.startsWith('45') || groupNum.startsWith('46') || groupNum.startsWith('47')) {
            newStatements.balance.equityAndLiabilities.liabilities[groupNum] = 
              (newStatements.balance.equityAndLiabilities.liabilities[groupNum] || 0) + amount;
          } else {
            newStatements.balance.equityAndLiabilities.equity[groupNum] = 
              (newStatements.balance.equityAndLiabilities.equity[groupNum] || 0) + amount;
          }
        } else if (account.startsWith('6')) {
          newStatements.income.revenues[groupNum] = 
            (newStatements.income.revenues[groupNum] || 0) + amount;
        }
      }
    });

    // Calculate totals
    newStatements.balance.assets.total = 
      Object.values(newStatements.balance.assets.nonCurrent).reduce((a, b) => a + b, 0) +
      Object.values(newStatements.balance.assets.current).reduce((a, b) => a + b, 0);

    newStatements.income.profitLoss = 
      Object.values(newStatements.income.revenues).reduce((a, b) => a + b, 0) -
      Object.values(newStatements.income.expenses).reduce((a, b) => a + b, 0);

    newStatements.balance.profitLoss = newStatements.income.profitLoss;

    newStatements.balance.equityAndLiabilities.total = 
      Object.values(newStatements.balance.equityAndLiabilities.equity).reduce((a, b) => a + b, 0) +
      Object.values(newStatements.balance.equityAndLiabilities.liabilities).reduce((a, b) => a + b, 0) +
      newStatements.balance.profitLoss;

    setStatements(newStatements);
  }, [transactions]);

  if (type === 'balance') {
    return (
      <div className="grid grid-cols-2 gap-8">
        {/* Assets Side */}
        <div>
          <h3 className="font-bold text-base mb-3 border-b pb-1">Aktíva</h3>
          <div className="space-y-4">
            {/* Non-current Assets */}
            <div>
              <h4 className="font-semibold text-sm mb-2">Neobežný majetok</h4>
              {Object.entries(statements.balance.assets.nonCurrent).map(([group, amount]) => (
                <div key={group} className="flex justify-between items-center text-sm py-0.5">
                  <span className="truncate pr-2">{group}</span>
                  <span className="text-right tabular-nums">{formatCurrency(amount)}</span>
                </div>
              ))}
            </div>

            {/* Current Assets */}
            <div>
              <h4 className="font-semibold text-sm mb-2">Obežný majetok</h4>
              {Object.entries(statements.balance.assets.current).map(([group, amount]) => (
                <div key={group} className="flex justify-between items-center text-sm py-0.5">
                  <span className="truncate pr-2">{group}</span>
                  <span className="text-right tabular-nums">{formatCurrency(amount)}</span>
                </div>
              ))}
            </div>

            {/* Total Assets */}
            <div className="pt-2 mt-2 border-t">
              <div className="flex justify-between items-center font-bold">
                <span>SPOLU AKTÍVA</span>
                <span className="text-right tabular-nums">
                  {formatCurrency(statements.balance.assets.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Equity and Liabilities Side */}
        <div>
          <h3 className="font-bold text-base mb-3 border-b pb-1">Pasíva</h3>
          <div className="space-y-4">
            {/* Equity */}
            <div>
              <h4 className="font-semibold text-sm mb-2">Vlastné imanie</h4>
              {Object.entries(statements.balance.equityAndLiabilities.equity).map(([group, amount]) => (
                <div key={group} className="flex justify-between items-center text-sm py-0.5">
                  <span className="truncate pr-2">{group}</span>
                  <span className="text-right tabular-nums">{formatCurrency(amount)}</span>
                </div>
              ))}
              {statements.balance.profitLoss !== 0 && (
                <div className="flex justify-between items-center text-sm py-0.5 font-semibold">
                  <span>Výsledok hospodárenia</span>
                  <span className={`text-right tabular-nums ${statements.balance.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(statements.balance.profitLoss)}
                  </span>
                </div>
              )}
            </div>

            {/* Liabilities */}
            <div>
              <h4 className="font-semibold text-sm mb-2">Záväzky</h4>
              {Object.entries(statements.balance.equityAndLiabilities.liabilities).map(([group, amount]) => (
                <div key={group} className="flex justify-between items-center text-sm py-0.5">
                  <span className="truncate pr-2">{group}</span>
                  <span className="text-right tabular-nums">{formatCurrency(amount)}</span>
                </div>
              ))}
            </div>

            {/* Total Equity and Liabilities */}
            <div className="pt-2 mt-2 border-t">
              <div className="flex justify-between items-center font-bold">
                <span>SPOLU PASÍVA</span>
                <span className="text-right tabular-nums">
                  {formatCurrency(statements.balance.equityAndLiabilities.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Income Statement
  return (
    <div className="grid grid-cols-2 gap-8">
      {/* Expenses Side */}
      <div>
        <h3 className="font-bold text-base mb-3 border-b pb-1">Náklady</h3>
        <div className="space-y-1">
          {Object.entries(statements.income.expenses).map(([group, amount]) => (
            <div key={group} className="flex justify-between items-center text-sm py-0.5">
              <span className="truncate pr-2">{group}</span>
              <span className="text-right tabular-nums">{formatCurrency(Math.abs(amount))}</span>
            </div>
          ))}
          <div className="pt-2 mt-2 border-t">
            <div className="flex justify-between items-center font-bold">
              <span>Náklady spolu</span>
              <span className="text-right tabular-nums">
                {formatCurrency(Object.values(statements.income.expenses).reduce((a, b) => a + b, 0))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Revenues Side */}
      <div>
        <h3 className="font-bold text-base mb-3 border-b pb-1">Výnosy</h3>
        <div className="space-y-1">
          {Object.entries(statements.income.revenues).map(([group, amount]) => (
            <div key={group} className="flex justify-between items-center text-sm py-0.5">
              <span className="truncate pr-2">{group}</span>
              <span className="text-right tabular-nums">{formatCurrency(amount)}</span>
            </div>
          ))}
          <div className="pt-2 mt-2 border-t">
            <div className="flex justify-between items-center font-bold">
              <span>Výnosy spolu</span>
              <span className="text-right tabular-nums">
                {formatCurrency(Object.values(statements.income.revenues).reduce((a, b) => a + b, 0))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profit/Loss */}
      <div className="col-span-2 mt-4 pt-2 border-t">
        <div className="flex justify-between items-center font-bold">
          <span>Výsledok hospodárenia</span>
          <span className={`text-right tabular-nums ${statements.income.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(statements.income.profitLoss)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FinancialStatements;