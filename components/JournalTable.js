import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

const JournalTable = ({ transactions, setTransactions }) => {
  const [errors, setErrors] = useState({});

  const addNewRow = () => {
    setTransactions([...transactions, { id: Date.now(), date: '', document: '', description: '', amount: '', debitAccount: '', creditAccount: '', taxAdjustment: '' }]);
  };

  const updateTransaction = (id, field, value) => {
    setTransactions(transactions.map(transaction => {
      if (transaction.id === id) {
        const updatedTransaction = { ...transaction, [field]: value };
        return updatedTransaction;
      }
      return transaction;
    }));
  };

  const deleteRow = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
    delete errors[id];
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Účtovný denník</CardTitle> {/* Changed to Slovak for "Journal" */}
          <Button onClick={addNewRow}>Pridať riadok</Button> {/* Changed to Slovak for "Add Row" */}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dátum</TableHead> {/* Date */}
                <TableHead>Č. dokladu</TableHead> {/* Document No. */}
                <TableHead>Popis</TableHead> {/* Description */}
                <TableHead>Suma (€)</TableHead> {/* Amount */}
                <TableHead>MD</TableHead> {/* Debit */}
                <TableHead>D</TableHead> {/* Credit */}
                <TableHead>OP/PP (€)</TableHead> {/* Tax Adjustment */}
                <TableHead>Akcie</TableHead> {/* Actions */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <React.Fragment key={transaction.id}>
                  <TableRow>
                    <TableCell>
                      <Input
                        type="date"
                        value={transaction.date}
                        onChange={(e) => updateTransaction(transaction.id, 'date', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={transaction.document}
                        onChange={(e) => updateTransaction(transaction.id, 'document', e.target.value)}
                        placeholder="Č. dokladu"  // Document No.
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={transaction.description}
                        onChange={(e) => updateTransaction(transaction.id, 'description', e.target.value)}
                        placeholder="Popis"  // Description
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={transaction.amount}
                        onChange={(e) => updateTransaction(transaction.id, 'amount', e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={transaction.debitAccount}
                        onChange={(e) => updateTransaction(transaction.id, 'debitAccount', e.target.value)}
                        placeholder="MD"  // Debit
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={transaction.creditAccount}
                        onChange={(e) => updateTransaction(transaction.id, 'creditAccount', e.target.value)}
                        placeholder="D"  // Credit
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={transaction.taxAdjustment}
                        onChange={(e) => updateTransaction(transaction.id, 'taxAdjustment', e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteRow(transaction.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        X
                      </Button>
                    </TableCell>
                  </TableRow>
                  {errors[transaction.id] && (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <Alert variant="destructive">
                          <AlertDescription>{errors[transaction.id]}</AlertDescription>
                        </Alert>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default JournalTable;
