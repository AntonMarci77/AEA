import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

const ClosingAccounts = ({ transactions }) => {
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('sk-SK', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(Math.abs(amount) || 0);
  };

  // Calculate account 710 (Účet ziskov a strát)
  const account710 = useMemo(() => {
    const debitSide = [];
    const creditSide = [];
    let totalDebit = 0;
    let totalCredit = 0;

    // Group expenses (5xx)
    const expenseGroups = {};
    transactions.forEach(transaction => {
      if (transaction.debitAccount?.startsWith('5') && 
          !['591', '592'].includes(transaction.debitAccount)) {
        const groupNum = transaction.debitAccount.substring(0, 2);
        expenseGroups[groupNum] = (expenseGroups[groupNum] || 0) + 
                                 (parseFloat(transaction.amount) || 0);
        totalDebit += parseFloat(transaction.amount) || 0;
      }
    });

    // Add expenses to debit side
    Object.entries(expenseGroups).sort().forEach(([group, amount]) => {
      if (amount !== 0) {
        debitSide.push({
          description: `${group} - ${accountStructure[group[0]]?.groups[group]?.name}`,
          amount
        });
      }
    });

    // Group revenues (6xx)
    const revenueGroups = {};
    transactions.forEach(transaction => {
      if (transaction.creditAccount?.startsWith('6')) {
        const groupNum = transaction.creditAccount.substring(0, 2);
        revenueGroups[groupNum] = (revenueGroups[groupNum] || 0) + 
                                 (parseFloat(transaction.amount) || 0);
        totalCredit += parseFloat(transaction.amount) || 0;
      }
    });

    // Add revenues to credit side
    Object.entries(revenueGroups).sort().forEach(([group, amount]) => {
      if (amount !== 0) {
        creditSide.push({
          description: `${group} - ${accountStructure[group[0]]?.groups[group]?.name}`,
          amount
        });
      }
    });

    // Add profit/loss to balance the account
    const difference = totalCredit - totalDebit;
    if (difference > 0) {
      // Profit - add to debit side
      debitSide.push({
        description: "Zisk",
        amount: difference,
        isResult: true
      });
      totalDebit += difference;
    } else if (difference < 0) {
      // Loss - add to credit side
      creditSide.push({
        description: "Strata",
        amount: -difference,
        isResult: true
      });
      totalCredit -= difference;
    }

    return { debitSide, creditSide, totalDebit, totalCredit };
  }, [transactions]);

  // Calculate account 702 (Konečný účet súvahový)
  const account702 = useMemo(() => {
    const debitSide = [];
    const creditSide = [];
    let totalDebit = 0;
    let totalCredit = 0;

    // Process all balance sheet accounts
    transactions.forEach(transaction => {
      const amount = parseFloat(transaction.amount) || 0;
      
      // Process debit entries
      if (transaction.debitAccount) {
        const groupNum = transaction.debitAccount.substring(0, 2);
        const classNum = transaction.debitAccount[0];
        
        // Assets increase on debit
        if (classNum === '0' || classNum === '1' || classNum === '2' || 
            groupNum === '31' || groupNum === '35' || 
            ['381', '382', '385'].includes(transaction.debitAccount)) {
          const key = `${groupNum} - ${accountStructure[classNum]?.groups[groupNum]?.name}`;
          const index = debitSide.findIndex(item => item.description === key);
          if (index === -1) {
            debitSide.push({ description: key, amount });
          } else {
            debitSide[index].amount += amount;
          }
          totalDebit += amount;
        }
        // Liabilities and Equity decrease on debit
        else if (classNum === '4' || groupNum === '32' || groupNum === '33' || 
                 groupNum === '36' || groupNum === '37' || 
                 ['383', '384'].includes(transaction.debitAccount)) {
          const key = `${groupNum} - ${accountStructure[classNum]?.groups[groupNum]?.name}`;
          const index = creditSide.findIndex(item => item.description === key);
          if (index === -1) {
            creditSide.push({ description: key, amount: -amount });
          } else {
            creditSide[index].amount -= amount;
          }
          totalCredit -= amount;
        }
      }

      // Process credit entries
      if (transaction.creditAccount) {
        const groupNum = transaction.creditAccount.substring(0, 2);
        const classNum = transaction.creditAccount[0];
        
        // Assets decrease on credit
        if (classNum === '0' || classNum === '1' || classNum === '2' || 
            groupNum === '31' || groupNum === '35' || 
            ['381', '382', '385'].includes(transaction.creditAccount)) {
          const key = `${groupNum} - ${accountStructure[classNum]?.groups[groupNum]?.name}`;
          const index = debitSide.findIndex(item => item.description === key);
          if (index === -1) {
            debitSide.push({ description: key, amount: -amount });
          } else {
            debitSide[index].amount -= amount;
          }
          totalDebit -= amount;
        }
        // Liabilities and Equity increase on credit
        else if (classNum === '4' || groupNum === '32' || groupNum === '33' || 
                 groupNum === '36' || groupNum === '37' || 
                 ['383', '384'].includes(transaction.creditAccount)) {
          const key = `${groupNum} - ${accountStructure[classNum]?.groups[groupNum]?.name}`;
          const index = creditSide.findIndex(item => item.description === key);
          if (index === -1) {
            creditSide.push({ description: key, amount });
          } else {
            creditSide[index].amount += amount;
          }
          totalCredit += amount;
        }
      }
    });

    // Add profit/loss from account 710
    const profitLoss = account710.totalCredit - account710.totalDebit;
    if (profitLoss > 0) {
      // Profit goes to credit side
      creditSide.push({
        description: "Zisk bežného obdobia",
        amount: profitLoss,
        isResult: true
      });
      totalCredit += profitLoss;
    } else if (profitLoss < 0) {
      // Loss goes to debit side
      debitSide.push({
        description: "Strata bežného obdobia",
        amount: -profitLoss,
        isResult: true
      });
      totalDebit -= profitLoss;
    }

    // Filter out zero amounts and sort
    const filteredDebitSide = debitSide
      .filter(item => Math.abs(item.amount) > 0.01)
      .sort((a, b) => a.description.localeCompare(b.description));
    
    const filteredCreditSide = creditSide
      .filter(item => Math.abs(item.amount) > 0.01)
      .sort((a, b) => a.description.localeCompare(b.description));

    return {
      debitSide: filteredDebitSide,
      creditSide: filteredCreditSide,
      totalDebit,
      totalCredit
    };
  }, [transactions, account710]);

  return (
    <div className="space-y-6">
      {/* Account 710 - Účet ziskov a strát */}
      <Card>
        <CardHeader>
          <CardTitle>710 - Účet ziskov a strát</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {/* Debit Side */}
            <div>
              <h3 className="font-semibold mb-2">MD</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Účet</TableHead>
                    <TableHead className="text-right">Suma</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {account710.debitSide.map((item, index) => (
                    <TableRow key={index} className={item.isResult ? 'font-bold' : ''}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold">
                    <TableCell>Spolu</TableCell>
                    <TableCell className="text-right">{formatCurrency(account710.totalDebit)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            {/* Credit Side */}
            <div>
              <h3 className="font-semibold mb-2">D</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Účet</TableHead>
                    <TableHead className="text-right">Suma</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {account710.creditSide.map((item, index) => (
                    <TableRow key={index} className={item.isResult ? 'font-bold' : ''}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold">
                    <TableCell>Spolu</TableCell>
                    <TableCell className="text-right">{formatCurrency(account710.totalCredit)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account 702 - Konečný účet súvahový */}
      <Card>
        <CardHeader>
          <CardTitle>702 - Konečný účet súvahový</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {/* Debit Side */}
            <div>
              <h3 className="font-semibold mb-2">MD</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Účet</TableHead>
                    <TableHead className="text-right">Suma</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {account702.debitSide.map((item, index) => (
                    <TableRow key={index} className={item.isResult ? 'font-bold' : ''}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold">
                    <TableCell>Spolu</TableCell>
                    <TableCell className="text-right">{formatCurrency(account702.totalDebit)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            {/* Credit Side */}
            <div>
              <h3 className="font-semibold mb-2">D</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Účet</TableHead>
                    <TableHead className="text-right">Suma</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {account702.creditSide.map((item, index) => (
                    <TableRow key={index} className={item.isResult ? 'font-bold' : ''}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold">
                    <TableCell>Spolu</TableCell>
                    <TableCell className="text-right">{formatCurrency(account702.totalCredit)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClosingAccounts;
