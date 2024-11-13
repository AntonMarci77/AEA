import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown } from 'lucide-react';
import accountStructure0 from '../lib/accountStructure0';
import accountStructure1 from '../lib/accountStructure1';
import accountStructure2 from '../lib/accountStructure2';
import accountStructure3 from '../lib/accountStructure3';
import accountStructure4 from '../lib/accountStructure4';
import accountStructure5 from '../lib/accountStructure5';
import accountStructure6 from '../lib/accountStructure6';
import accountStructure789 from '../lib/accountStructure789';

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

const JournalTable = ({ transactions, setTransactions }) => {
  const [errors, setErrors] = useState({});

  const findAccount = (accountNumber) => {
    if (!accountNumber || accountNumber.length !== 3) return null;
    const classNum = accountNumber[0];
    const groupNum = accountNumber.slice(0, 2);
    return accountStructure[classNum]?.groups[groupNum]?.accounts[accountNumber];
  };

  const validateAccountCombination = (debitAccount, creditAccount) => {
    const isInternal = (acc) => acc.startsWith('8') || acc.startsWith('9');
    return isInternal(debitAccount) === isInternal(creditAccount);
  };

  const addNewRow = () => {
    setTransactions([...transactions, { id: Date.now(), date: '', document: '', description: '', amount: '', debitAccount: '', creditAccount: '', taxAdjustment: '' }]);
  };

  const updateTransaction = (id, field, value) => {
    setTransactions(transactions.map(transaction => {
      if (transaction.id === id) {
        const updatedTransaction = { ...transaction, [field]: value };
        if (field === 'debitAccount' || field === 'creditAccount') {
          if (value.length === 3 && !findAccount(value)) {
            setErrors({ ...errors, [id]: "Invalid account number" });
          } else if (value.length > 3) {
            setErrors({ ...errors, [id]: "Account number must have 3 digits" });
          } else {
            delete errors[id];
          }
        }
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
          <CardTitle>Journal</CardTitle>
          <Button onClick={addNewRow}>Add Row</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Document</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount (€)</TableHead>
                <TableHead>Debit</TableHead>
                <TableHead>Credit</TableHead>
                <TableHead>Tax Adjustment (€)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <React.Fragment key={transaction.id}>
                  <TableRow>
                    <TableCell>
                      <Input type="date" value={transaction.date} onChange={(e) => updateTransaction(transaction.id, 'date', e.target.value)} />
                    </TableCell>
                    <TableCell>
                      <Input value={transaction.document} onChange={(e) => updateTransaction(transaction.id, 'document', e.target.value)} placeholder="Document No." />
                    </TableCell>
                    <TableCell>
                      <Input value={transaction.description} onChange={(e) => updateTransaction(transaction.id, 'description', e.target.value)} placeholder="Description" />
                    </TableCell>
                    <TableCell>
                      <Input type="number" value={transaction.amount} onChange={(e) => updateTransaction(transaction.id, 'amount', e.target.value)} placeholder="0.00" step="0.01" />
                    </TableCell>
                    <TableCell>
                      <Input value={transaction.debitAccount} onChange={(e) => updateTransaction(transaction.id, 'debitAccount', e.target.value)} placeholder="Debit Account" />
                    </TableCell>
                    <TableCell>
                      <Input value={transaction.creditAccount} onChange={(e) => updateTransaction(transaction.id, 'creditAccount', e.target.value)} placeholder="Credit Account" />
                    </TableCell>
                    <TableCell>
                      <Input type="number" value={transaction.taxAdjustment} onChange={(e) => updateTransaction(transaction.id, 'taxAdjustment', e.target.value)} placeholder="0.00" step="0.01" />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => deleteRow(transaction.id)} className="text-red-500 hover:text-red-700">X</Button>
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
