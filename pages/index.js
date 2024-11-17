import React, { useState } from "react";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [financialPosition, setFinancialPosition] = useState({
    assets: { current_assets: 0, non_current_assets: 0, total_assets: 0 },
    equity_liabilities: {
      equity: 0,
      current_liabilities: 0,
      non_current_liabilities: 0,
      profit: 0,
      total_equity_liabilities: 0,
    },
  });
  const [incomeStatement, setIncomeStatement] = useState({
    expenses: 0,
    revenues: 0,
    profit: 0,
  });

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">Vzdelávací účtovný program</h1>

      {/* Transaction Form Section */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <strong>Pridať novú transakciu</strong>
        </div>
        <div className="card-body">
          <form>
            <div className="form-row">
              <div className="form-group col-md-2">
                <label htmlFor="date">Dátum</label>
                <input type="date" id="date" name="date" required className="form-control" />
              </div>
              <div className="form-group col-md-3">
                <label htmlFor="transaction_id">ID transakcie</label>
                <input type="text" id="transaction_id" name="transaction_id" placeholder="ID transakcie" required className="form-control" />
              </div>
              <div className="form-group col-md-5">
                <label htmlFor="description">Popis</label>
                <input type="text" id="description" name="description" placeholder="Popis transakcie" required className="form-control" />
              </div>
              <div className="form-group col-md-2 d-flex align-items-end">
                <button type="submit" className="btn btn-primary btn-block">Pridať transakciu</button>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-3">
                <label htmlFor="debit_account">MD (debetný účet)</label>
                <input type="text" id="debit_account" name="debit_account" placeholder="MD účet" required className="form-control" />
              </div>
              <div className="form-group col-md-3">
                <label htmlFor="credit_account">D (kreditný účet)</label>
                <input type="text" id="credit_account" name="credit_account" placeholder="D účet" required className="form-control" />
              </div>
              <div className="form-group col-md-2">
                <label htmlFor="amount">Suma (€)</label>
                <input type="number" step="0.01" id="amount" name="amount" placeholder="Suma" required className="form-control" />
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Accounting Journal Section */}
      <div className="card mb-4">
        <div className="card-header bg-info text-white">
          <strong>Účtovný denník</strong>
        </div>
        <div className="card-body">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Dátum</th>
                <th>ID transakcie</th>
                <th>Popis</th>
                <th>MD</th>
                <th>D</th>
                <th>Suma (€)</th>
                <th>Akcie</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.date}</td>
                  <td>{entry.transaction_id}</td>
                  <td>{entry.description}</td>
                  <td>{entry.debit_account}</td>
                  <td>{entry.credit_account}</td>
                  <td>{entry.amount}</td>
                  <td>
                    <button className="btn btn-danger btn-sm">Zmazať</button>
                    <button className="btn btn-warning btn-sm">Upraviť</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Financial Statements Section */}
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-secondary text-white">Výkaz o finančnej pozícii</div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>Kategória</th>
                    <th>Suma (€)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Krátkodobý majetok</td>
                    <td>{financialPosition.assets.current_assets}</td>
                  </tr>
                  <tr>
                    <td>Dlhodobý majetok</td>
                    <td>{financialPosition.assets.non_current_assets}</td>
                  </tr>
                  <tr>
                    <td>Vlastné imanie</td>
                    <td>{financialPosition.equity_liabilities.equity}</td>
                  </tr>
                  <tr>
                    <td>Zisk</td>
                    <td>{incomeStatement.profit}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
