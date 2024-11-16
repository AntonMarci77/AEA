const FinancialStatements = ({ transactions, type }) => {
  // ... keep existing state and calculation logic ...

  // Balance Sheet Layout
  if (type === 'balance') {
    return (
      <div className="border rounded-lg p-4">
        <div className="grid grid-cols-2 gap-8">
          {/* Assets Side */}
          <div>
            <h3 className="font-bold text-base mb-3 border-b pb-1">Aktíva</h3>
            <div className="space-y-4">
              {/* Non-current Assets */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Neobežný majetok</h4>
                {Object.entries(balanceSheet.assets.nonCurrent).map(([group, amount]) => (
                  <div key={group} className="flex justify-between items-center text-sm py-0.5">
                    <span className="truncate pr-2">{group}</span>
                    <span className="text-right tabular-nums">{formatCurrency(amount)}</span>
                  </div>
                ))}
              </div>
              
              {/* Current Assets */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Obežný majetok</h4>
                {Object.entries(balanceSheet.assets.current).map(([group, amount]) => (
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
                  <span className="text-right tabular-nums">{formatCurrency(totalAssets)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Equity and Liabilities Side */}
          <div className="border-l pl-8">
            <h3 className="font-bold text-base mb-3 border-b pb-1">Pasíva</h3>
            <div className="space-y-4">
              {/* Equity */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Vlastné imanie</h4>
                {Object.entries(balanceSheet.equityAndLiabilities.equity).map(([group, amount]) => (
                  <div key={group} className="flex justify-between items-center text-sm py-0.5">
                    <span className="truncate pr-2">{group}</span>
                    <span className="text-right tabular-nums">{formatCurrency(amount)}</span>
                  </div>
                ))}
                {profitLoss !== 0 && (
                  <div className="flex justify-between items-center text-sm py-0.5 font-semibold">
                    <span>Výsledok hospodárenia</span>
                    <span className={`text-right tabular-nums ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(profitLoss)}
                    </span>
                  </div>
                )}
              </div>

              {/* Liabilities */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Záväzky</h4>
                {Object.entries(balanceSheet.equityAndLiabilities.liabilities).map(([group, amount]) => (
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
                  <span className="text-right tabular-nums">{formatCurrency(totalEquityAndLiabilities)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Income Statement Layout
  return (
    <div className="border rounded-lg p-4">
      <div className="grid grid-cols-2 gap-8">
        {/* Expenses Side */}
        <div>
          <h3 className="font-bold text-base mb-3 border-b pb-1">Náklady</h3>
          <div className="space-y-1">
            {Object.entries(incomeStatement.expenses).map(([group, amount]) => (
              <div key={group} className="flex justify-between items-center text-sm py-0.5">
                <span className="truncate pr-2">{group}</span>
                <span className="text-right tabular-nums">{formatCurrency(Math.abs(amount))}</span>
              </div>
            ))}
            <div className="pt-2 mt-2 border-t">
              <div className="flex justify-between items-center font-bold">
                <span>Náklady spolu</span>
                <span className="text-right tabular-nums">{formatCurrency(totalExpenses)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Revenues Side */}
        <div className="border-l pl-8">
          <h3 className="font-bold text-base mb-3 border-b pb-1">Výnosy</h3>
          <div className="space-y-1">
            {Object.entries(incomeStatement.revenues).map(([group, amount]) => (
              <div key={group} className="flex justify-between items-center text-sm py-0.5">
                <span className="truncate pr-2">{group}</span>
                <span className="text-right tabular-nums">{formatCurrency(amount)}</span>
              </div>
            ))}
            <div className="pt-2 mt-2 border-t">
              <div className="flex justify-between items-center font-bold">
                <span>Výnosy spolu</span>
                <span className="text-right tabular-nums">{formatCurrency(totalRevenues)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profit/Loss at the bottom */}
      <div className="mt-4 pt-2 border-t">
        <div className="flex justify-between items-center font-bold">
          <span>Výsledok hospodárenia</span>
          <span className={`text-right tabular-nums ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(profitLoss)}
          </span>
        </div>
      </div>
    </div>
  );
};