import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

  // Calculate statements (same calculation logic as before)
  useEffect(() => {
    // Your existing calculation logic here
  }, [transactions]);

  return (
    <div className="space-y-8">
      {/* Balance Sheet */}
      <Card>
        <CardHeader>
          <CardTitle>Súvaha</CardTitle>
          {balanceError && (
            <Alert variant="destructive">
              <AlertDescription>
                Súvaha nie je vyrovnaná (Aktíva ≠ Pasíva)
              </AlertDescription>
            </Alert>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-8">
            {/* Assets Side */}
            <div>
              <h3 className="font-bold text-lg mb-4">Aktíva</h3>
              
              {/* Non-current Assets */}
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Neobežný majetok</h4>
                <div className="space-y-2">
                  {Object.entries(statements.balanceSheet.assets.nonCurrent).map(([group, amount]) => (
                    <div key={group} className="flex justify-between">
                      <span>{group}</span>
                      <span>{formatCurrency(amount)}</span>
                    </div>
                  ))}
                  {/* Contra accounts for non-current assets */}
                  {Object.entries(statements.balanceSheet.assets.contraAccounts)
                    .filter(([group]) => group.startsWith('0'))
                    .map(([group, amount]) => (
                      <div key={group} className="flex justify-between text-red-600">
                        <span>{group}</span>
                        <span>({formatCurrency(Math.abs(amount))})</span>
                      </div>
                    ))}
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Spolu neobežný majetok</span>
                    <span>{formatCurrency(
                      Object.values(statements.balanceSheet.assets.nonCurrent).reduce((a, b) => a + b, 0) -
                      Object.entries(statements.balanceSheet.assets.contraAccounts)
                        .filter(([group]) => group.startsWith('0'))
                        .reduce((sum, [_, amount]) => sum + amount, 0)
                    )}</span>
                  </div>
                </div>
              </div>

              {/* Current Assets */}
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Obežný majetok</h4>
                <div className="space-y-2">
                  {Object.entries(statements.balanceSheet.assets.current).map(([group, amount]) => (
                    <div key={group} className="flex justify-between">
                      <span>{group}</span>
                      <span>{formatCurrency(amount)}</span>
                    </div>
                  ))}
                  {/* Contra accounts for current assets */}
                  {Object.entries(statements.balanceSheet.assets.contraAccounts)
                    .filter(([group]) => !group.startsWith('0'))
                    .map(([group, amount]) => (
                      <div key={group} className="flex justify-between text-red-600">
                        <span>{group}</span>
                        <span>({formatCurrency(Math.abs(amount))})</span>
                      </div>
                    ))}
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Spolu obežný majetok</span>
                    <span>{formatCurrency(
                      Object.values(statements.balanceSheet.assets.current).reduce((a, b) => a + b, 0) -
                      Object.entries(statements.balanceSheet.assets.contraAccounts)
                        .filter(([group]) => !group.startsWith('0'))
                        .reduce((sum, [_, amount]) => sum + amount, 0)
                    )}</span>
                  </div>
                </div>
              </div>

              {/* Total Assets */}
              <div className="border-t-2 border-black pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>SPOLU AKTÍVA</span>
                  <span>{formatCurrency(statements.balanceSheet.assets.total)}</span>
                </div>
              </div>
            </div>

            {/* Equity and Liabilities Side */}
            <div>
              <h3 className="font-bold text-lg mb-4">Pasíva</h3>

              {/* Equity */}
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Vlastné imanie</h4>
                <div className="space-y-2">
                  {Object.entries(statements.balanceSheet.equityAndLiabilities.equity).map(([group, amount]) => (
                    <div key={group} className="flex justify-between">
                      <span>{group}</span>
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
              </div>

              {/* Non-current Liabilities */}
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Dlhodobé záväzky</h4>
                <div className="space-y-2">
                  {Object.entries(statements.balanceSheet.equityAndLiabilities.nonCurrentLiabilities).map(([group, amount]) => (
                    <div key={group} className="flex justify-between">
                      <span>{group}</span>
                      <span>{formatCurrency(amount)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Liabilities */}
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Krátkodobé záväzky</h4>
                <div className="space-y-2">
                  {Object.entries(statements.balanceSheet.equityAndLiabilities.currentLiabilities).map(([group, amount]) => (
                    <div key={group} className="flex justify-between">
                      <span>{group}</span>
                      <span>{formatCurrency(amount)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Equity and Liabilities */}
              <div className="border-t-2 border-black pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>SPOLU PASÍVA</span>
                  <span>{formatCurrency(statements.balanceSheet.equityAndLiabilities.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Income Statement */}
      <Card>
        <CardHeader>
          <CardTitle>Výkaz ziskov a strát</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-8">
            {/* Expenses Side */}
            <div>
              <h3 className="font-bold text-lg mb-4">Náklady</h3>
              <div className="space-y-2">
                {Object.entries(statements.incomeStatement.expenses).map(([group, amount]) => (
                  <div key={group} className="flex justify-between">
                    <span>{group}</span>
                    <span>{formatCurrency(Math.abs(amount))}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 mt-4">
                <div className="flex justify-between font-bold">
                  <span>Náklady spolu</span>
                  <span>{formatCurrency(
                    Object.values(statements.incomeStatement.expenses).reduce((a, b) => a + Math.abs(b), 0)
                  )}</span>
                </div>
              </div>
            </div>

            {/* Revenues Side */}
            <div>
              <h3 className="font-bold text-lg mb-4">Výnosy</h3>
              <div className="space-y-2">
                {Object.entries(statements.incomeStatement.revenues).map(([group, amount]) => (
                  <div key={group} className="flex justify-between">
                    <span>{group}</span>
                    <span>{formatCurrency(amount)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 mt-4">
                <div className="flex justify-between font-bold">
                  <span>Výnosy spolu</span>
                  <span>{formatCurrency(
                    Object.values(statements.incomeStatement.revenues).reduce((a, b) => a + b, 0)
                  )}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Profit/Loss at the bottom */}
          <div className="border-t-2 border-black mt-8 pt-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Výsledok hospodárenia</span>
              <span className={statements.incomeStatement.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}>
                {formatCurrency(statements.incomeStatement.profitLoss)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialStatements;