import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import account structures
import accountStructure0 from '../lib/accountStructure0';
import accountStructure1 from '../lib/accountStructure1';
import accountStructure2 from '../lib/accountStructure2';
import accountStructure3 from '../lib/accountStructure3';
import accountStructure4 from '../lib/accountStructure4';
import accountStructure5 from '../lib/accountStructure5';
import accountStructure6 from '../lib/accountStructure6';
import accountStructure789 from '../lib/accountStructure789';

// Combine all account structures
const accountStructure = {
  ...accountStructure0,
  ...accountStructure1,
  ...accountStructure2,
  ...accountStructure3,
  ...accountStructure4,
  ...accountStructure5,
  ...accountStructure6,
  ...accountStructure789
};

const FinancialStatements = ({ transactions }) => {
  const [balanceError, setBalanceError] = useState(false);
  const [statements, setStatements] = useState({
    balanceSheet: {
      assets: {
        nonCurrent: {},
        current: {},
        contraAccounts: {},
        total: 0
      },
      equityAndLiabilities: {
        equity: {},
        nonCurrentLiabilities: {},
        currentLiabilities: {},
        profitLoss: 0,
        total: 0
      }
    },
    incomeStatement: {
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

  // Calculate financial statements
  useEffect(() => {
    const calculateStatements = () => {
      let balanceSheet = {
        assets: {
          nonCurrent: {},
          current: {},
          contraAccounts: {},
          total: 0
        },
        equityAndLiabilities: {
          equity: {},
          nonCurrentLiabilities: {},
          currentLiabilities: {},
          profitLoss: 0,
          total: 0
        }
      };

      let incomeStatement = {
        expenses: {},
        revenues: {},
        profitLoss: 0
      };

      // Process transactions
      transactions.forEach(transaction => {
        const amount = parseFloat(transaction.amount) || 0;

        // Process debit entries
        if (transaction.debitAccount) {
          const groupNum = transaction.debitAccount.substring(0, 2);
          const classNum = transaction.debitAccount[0];

          // Handle asset accounts
          if (classNum === '0') {
            balanceSheet.assets.nonCurrent[groupNum] = (balanceSheet.assets.nonCurrent[groupNum] || 0) + amount;
          } else if (['1', '2'].includes(classNum) || 
                     transaction.debitAccount.startsWith('31') ||
                     ['335', '381', '382', '385'].includes(transaction.debitAccount)) {
            balanceSheet.assets.current[groupNum] = (balanceSheet.assets.current[groupNum] || 0) + amount;
          }

          // Handle expense accounts
          if (classNum === '5' && !['591', '592'].includes(transaction.debitAccount)) {
            incomeStatement.expenses[groupNum] = (incomeStatement.expenses[groupNum] || 0) + amount;
          }
        }

        // Process credit entries
        if (transaction.creditAccount) {
          const groupNum = transaction.creditAccount.substring(0, 2);
          const classNum = transaction.creditAccount[0];

          // Handle liability and equity accounts
          if (classNum === '4') {
            if (['45', '46', '47'].includes(groupNum)) {
              balanceSheet.equityAndLiabilities.nonCurrentLiabilities[groupNum] = 
                (balanceSheet.equityAndLiabilities.nonCurrentLiabilities[groupNum] || 0) + amount;
            } else if (['41', '42', '43'].includes(groupNum)) {
              balanceSheet.equityAndLiabilities.equity[groupNum] = 
                (balanceSheet.equityAndLiabilities.equity[groupNum] || 0) + amount;
            }
          }

          // Handle current liabilities
          if (['32', '33', '36', '37'].includes(groupNum) || 
              ['383', '384'].includes(transaction.creditAccount)) {
            balanceSheet.equityAndLiabilities.currentLiabilities[groupNum] = 
              (balanceSheet.equityAndLiabilities.currentLiabilities[groupNum] || 0) + amount;
          }

          // Handle revenue accounts
          if (classNum === '6') {
            incomeStatement.revenues[groupNum] = (incomeStatement.revenues[groupNum] || 0) + amount;
          }
        }
      });

      // Calculate contra accounts (negative assets)
      transactions.forEach(transaction => {
        if (transaction.debitAccount) {
          const groupNum = transaction.debitAccount.substring(0, 2);
          if (['07', '08', '09', '19', '29'].includes(groupNum)) {
            balanceSheet.assets.contraAccounts[groupNum] = 
              (balanceSheet.assets.contraAccounts[groupNum] || 0) - parseFloat(transaction.amount || 0);
          }
        }
        if (transaction.creditAccount) {
          const groupNum = transaction.creditAccount.substring(0, 2);
          if (['07', '08', '09', '19', '29'].includes(groupNum)) {
            balanceSheet.assets.contraAccounts[groupNum] = 
              (balanceSheet.assets.contraAccounts[groupNum] || 0) + parseFloat(transaction.amount || 0);
          }
        }
      });

      // Calculate totals
      balanceSheet.assets.total = 
        Object.values(balanceSheet.assets.nonCurrent).reduce((sum, val) => sum + val, 0) +
        Object.values(balanceSheet.assets.current).reduce((sum, val) => sum + val, 0) +
        Object.values(balanceSheet.assets.contraAccounts).reduce((sum, val) => sum + val, 0);

      // Calculate profit/loss
      incomeStatement.profitLoss = 
        Object.values(incomeStatement.revenues).reduce((sum, val) => sum + val, 0) -
        Object.values(incomeStatement.expenses).reduce((sum, val) => sum + val, 0);

      // Add profit/loss to equity
      balanceSheet.equityAndLiabilities.profitLoss = incomeStatement.profitLoss;

      // Calculate total equity and liabilities
      balanceSheet.equityAndLiabilities.total =
        Object.values(balanceSheet.equityAndLiabilities.equity).reduce((sum, val) => sum + val, 0) +
        Object.values(balanceSheet.equityAndLiabilities.nonCurrentLiabilities).reduce((sum, val) => sum + val, 0) +
        Object.values(balanceSheet.equityAndLiabilities.currentLiabilities).reduce((sum, val) => sum + val, 0) +
        balanceSheet.equityAndLiabilities.profitLoss;

      // Check if balance sheet balances
      setBalanceError(Math.abs(balanceSheet.assets.total - balanceSheet.equityAndLiabilities.total) > 0.01);

      setStatements({
        balanceSheet,
        incomeStatement
      });
    };

    calculateStatements();
  }, [transactions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Účtovná Závierka</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="balance">
          <TabsList>
            <TabsTrigger value="balance">Súvaha</TabsTrigger>
            <TabsTrigger value="income">Výkaz ziskov a strát</TabsTrigger>
          </TabsList>

          {/* Balance Sheet */}
          <TabsContent value="balance">
            {balanceError && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>
                  Upozornenie: Súvaha nie je vyrovnaná (Aktíva ≠ Pasíva)
                </AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-2 gap-4">
              {/* Assets Side */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Aktíva</h3>
                
                {/* Non-current Assets */}
                <div className="space-y-2">
                  <h4 className="font-semibold">Neobežný majetok</h4>
                  {Object.entries(statements.balanceSheet.assets.nonCurrent).map(([group, amount]) => (
                    <div key={group} className="flex justify-between">
                      <span>{accountStructure[group[0]]?.groups[group]?.name}</span>
                      <span>{formatCurrency(amount)}</span>
                    </div>
                  ))}
                  {Object.entries(statements.balanceSheet.assets.contraAccounts)
                    .filter(([group]) => group.startsWith('0'))
                    .map(([group, amount]) => (
                      <div key={group} className="flex justify-between text-red-600">
                        <span>{accountStructure[group[0]]?.groups[group]?.name}</span>
                        <span>({formatCurrency(Math.abs(amount))})</span>
                      </div>
                    ))}
                </div>

                {/* Current Assets */}
                <div className="space-y-2">
                  <h4 className="font-semibold">Obežný majetok</h4>
                  {Object.entries(statements.balanceSheet.assets.current).map(([group, amount]) => (
                    <div key={group} className="flex justify-between">
                      <span>{accountStructure[group[0]]?.groups[group]?.name}</span>
                      <span>{formatCurrency(amount)}</span>
                    </div>
                  ))}
                  {Object.entries(statements.balanceSheet.assets.contraAccounts)
                    .filter(([group]) => !group.startsWith('0'))
                    .map(([group, amount]) => (
                      <div key={group} className="flex justify-between text-red-600">
                        <span>{accountStructure[group[0]]?.groups[group]?.name}</span>
                        <span>({formatCurrency(Math.abs(amount))})</span>
                      </div>
                    ))}
                </div>

                {/* Total Assets */}
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold">
                    <span>SPOLU AKTÍVA</span>
                    <span>{formatCurrency(statements.balanceSheet.assets.total)}</span>
                  </div>
                </div>
              </div>

              {/* Equity and Liabilities Side */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Pasíva</h3>

                {/* Equity */}
                <div className="space-y-2">
                  <h4 className="font-semibold">Vlastné imanie</h4>
                  {Object.entries(statements.balanceSheet.equityAndLiabilities.equity).map(([group, amount]) => (
                    <div key={group} className="flex justify-between">
                      <span>{accountStructure[group[0]]?.groups[group]?.name}</span>
                      <span>{formatCurrency(amount)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-semibold">
                    <span>Výsledok hospodárenia</span>
                    <span className={statements.balanceSheet.equityAndLiabilities.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(statements.balanceSheet.equityAndLiabilities.profitLoss)}
                    </span>
                  </div>
                </div>

                {/* Non-current Liabilities */}
                <div className="space-y-2">
                  <h4 className="font-semibold">Dlhodobé záväzky</h4>
                  {Object.entries(statements.balanceSheet.equityAndLiabilities.nonCurrentLiabilities).map(([group, amount]) => (
                    <div key={group} className="flex justify-between">
                      <span>{accountStructure[group[0]]?.groups[group]?.name}</span>
                      <span>{formatCurrency(amount)}</span>
                    </div>
                  ))}
                </div>

                {/* Current Liabilities */}
                <div className="space-y-2">
                  <h4 className="font-semibold">Krátkodobé záväzky</h4>
                  {Object.entries(statements.balanceSheet.equityAndLiabilities.currentLiabilities).map(([group, amount]) => (
                    <div key={group} className="flex justify-between">
                      <span>{accountStructure[group[0]]?.groups[group]?.name}</span>
                      <span>{formatCurrency(amount)}</span>
                    </div>
                  ))}
                </div>

                {/* Total Equity and Liabilities */}
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold">
                    <span>SPOLU PASÍVA</span>
                    <span>{formatCurrency(statements.balanceSheet.equityAndLiabilities.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Income Statement */}
          <TabsContent value="income">
            <div className="grid grid-cols-2 gap-4">
              {/* Expenses Side */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Náklady</h3>
                {Object.entries(statements.incomeStatement.expenses).map(([group, amount]) => (
                  <div key={group} className="flex justify-between">
                    <span>{accountStructure[group[0]]?.groups[group]?.name}</span>
                    <span>{formatCurrency(amount)}</span>
                  </div>
                ))}
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold">
                    <span>Náklady spolu</span>
                    <span>
                      {formatCurrency(
                        Object.values(statements.incomeStatement.expenses).reduce((sum, val) => sum + val, 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Revenues Side */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Výnosy</h3>
                {Object.entries(statements.incomeStatement.revenues).map(([group, amount]) => (
                  <div key={group} className="flex justify-between">
                    <span>{accountStructure[group[0]]?.groups[group]?.name}</span>
                    <span>{formatCurrency(amount)}</span>
                  </div>
                ))}
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold">
                    <span>Výnosy spolu</span>
                    <span>
                      {formatCurrency(
                        Object.values(statements.incomeStatement.revenues).reduce((sum, val) => sum + val, 0)
                      )}
                    </span>
                  </div>
                </div>

                {/* Profit/Loss */}
                <div className="mt-4 pt-2 border-t">
                  <div className="flex justify-between font-bold">
                    <span>Výsledok hospodárenia</span>
                    <span className={statements.incomeStatement.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(statements.incomeStatement.profitLoss)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FinancialStatements;