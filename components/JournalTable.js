import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, ChevronDown } from 'lucide-react';

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

const JournalTable = ({ transactions, setTransactions }) => {
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [activeField, setActiveField] = useState({ id: null, field: null });
  const [errors, setErrors] = useState({});

  // Find account in structure
  const findAccount = (accountNumber) => {
    if (!accountNumber) return null;
    const classNum = accountNumber.substring(0, 1);
    const groupNum = accountNumber.substring(0, 2);
    return accountStructure[classNum]?.groups[groupNum]?.accounts[accountNumber];
  };

  // Validate account combination
  const validateAccountCombination = (debitAccount, creditAccount) => {
    if (!debitAccount || !creditAccount) return true;

    // Internal accounts (8, 9) can only be combined with other internal accounts
    const isDebitInternal = debitAccount.startsWith('8') || debitAccount.startsWith('9');
    const isCreditInternal = creditAccount.startsWith('8') || creditAccount.startsWith('9');
    
    return isDebitInternal === isCreditInternal;
  };

  // Add new row
  const addNewRow = () => {
    setTransactions([
      ...transactions,
      {
        id: Date.now(),
        date: '',
        document: '',
        description: '',
        amount: '',
        debitAccount: '',
        creditAccount: '',
        taxAdjustment: ''
      }
    ]);
  };

  // Update transaction
  const updateTransaction = (id, field, value) => {
    const newTransactions = transactions.map(transaction => {
      if (transaction.id === id) {
        const updatedTransaction = { ...transaction, [field]: value };
        
        // Validate accounts if either account field is changed
        if (field === 'debitAccount' || field === 'creditAccount') {
          const debitAccount = field === 'debitAccount' ? value : transaction.debitAccount;
          const creditAccount = field === 'creditAccount' ? value : transaction.creditAccount;
          
          // Validate account exists
          if (value && !findAccount(value)) {
            setErrors(prev => ({ ...prev, [id]: "Neplatný účet" }));
            return updatedTransaction;
          }
          
          // Validate combination
          if (debitAccount && creditAccount && !validateAccountCombination(debitAccount, creditAccount)) {
            setErrors(prev => ({ ...prev, [id]: "Neplatná kombinácia účtov" }));
            return updatedTransaction;
          }
          
          // Clear error if valid
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[id];
            return newErrors;
          });
        }
        
        return updatedTransaction;
      }
      return transaction;
    });
    
    setTransactions(newTransactions);
  };

  // Delete row
  const deleteRow = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
  };

  // Custom Account Input Component
  const AccountInput = ({ value, onChange, id, field }) => {
    const [suggestions, setSuggestions] = useState([]);

    const handleSearch = (term) => {
      const results = [];
      Object.entries(accountStructure).forEach(([classNum, classData]) => {
        Object.entries(classData.groups).forEach(([groupNum, groupData]) => {
          Object.entries(groupData.accounts).forEach(([accountNum, accountData]) => {
            if (accountNum === "ALL") return;
            if (
              accountNum.includes(term) ||
              accountData.name.toLowerCase().includes(term.toLowerCase())
            ) {
              results.push({
                number: accountNum,
                name: accountData.name,
                type: accountData.type,
                kind: accountData.kind
              });
            }
          });
        });
      });
      return results.slice(0, 10);
    };

    return (
      <div className="relative flex">
        <Popover>
          <PopoverTrigger asChild>
            <div className="relative w-full">
              <Input
                value={value}
                onChange={(e) => {
                  onChange(id, field, e.target.value);
                  setSuggestions(handleSearch(e.target.value));
                }}
                className="w-full pr-8"
                placeholder="Účet"
              />
              <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 opacity-50" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Hľadať účet..." />
              <CommandList>
                <CommandEmpty>Žiadne výsledky</CommandEmpty>
                <CommandGroup>
                  {suggestions.map((account) => (
                    <CommandItem
                      key={account.number}
                      onSelect={() => {
                        onChange(id, field, account.number);
                        setSuggestions([]);
                      }}
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <span className="font-medium">{account.number}</span>
                          <span className="mx-2">-</span>
                          <span>{account.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {account.type}, {account.kind}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Účtovný denník</CardTitle>
          <Button onClick={addNewRow}>Pridať riadok</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dátum</TableHead>
                <TableHead>Doklad</TableHead>
                <TableHead>Text</TableHead>
                <TableHead>Suma (€)</TableHead>
                <TableHead>MD</TableHead>
                <TableHead>D</TableHead>
                <TableHead>OP/PP (€)</TableHead>
                <TableHead></TableHead>
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
                        placeholder="Č. dokladu"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={transaction.description}
                        onChange={(e) => updateTransaction(transaction.id, 'description', e.target.value)}
                        placeholder="Popis"
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
                      <AccountInput
                        value={transaction.debitAccount}
                        onChange={updateTransaction}
                        id={transaction.id}
                        field="debitAccount"
                      />
                    </TableCell>
                    <TableCell>
                      <AccountInput
                        value={transaction.creditAccount}
                        onChange={updateTransaction}
                        id={transaction.id}
                        field="creditAccount"
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
