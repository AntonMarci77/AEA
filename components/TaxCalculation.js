import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

const TaxCalculation = ({ 
  transactions, 
  nonTaxableRevenues, 
  isNaturalPerson, 
  setIsNaturalPerson,
  otherDeductionsBeforeLoss,
  setOtherDeductionsBeforeLoss,
  taxLossFromPrevious,
  setTaxLossFromPrevious,
  otherDeductionsAfterLoss,
  setOtherDeductionsAfterLoss
}) => {
  const [taxValues, setTaxValues] = useState({
    accountingResult: 0,
    taxAdjustments: 0,
    taxableRevenues: 0,
    initialTaxBase: 0,
    finalTaxBase: 0,
    taxRate: 0,
    tax: 0
  });

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('sk-SK', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  // Calculate tax values
  useEffect(() => {
    // Calculate accounting result (without 591, 592)
    let accountingResult = 0;
    let taxableRevenues = 0;
    let taxAdjustments = 0;

    transactions.forEach(transaction => {
      const amount = parseFloat(transaction.amount) || 0;
      
      // Add revenues
      if (transaction.creditAccount?.startsWith('6')) {
        accountingResult += amount;
        // Add to taxable revenues if not in nonTaxableRevenues
        if (!nonTaxableRevenues.includes(transaction.creditAccount)) {
          taxableRevenues += amount;
        }
      }
      
      // Subtract expenses (except 591, 592)
      if (transaction.debitAccount?.startsWith('5') && 
          !['591', '592'].includes(transaction.debitAccount)) {
        accountingResult -= amount;
      }

      // Add tax adjustments
      taxAdjustments += parseFloat(transaction.taxAdjustment) || 0;
    });

    // Calculate initial tax base
    let taxBase = accountingResult + taxAdjustments;
    
    // Subtract deductions before tax loss
    taxBase = Math.max(0, taxBase - otherDeductionsBeforeLoss);
    
    // Apply tax loss (cannot go below 0)
    taxBase = Math.max(0, taxBase - taxLossFromPrevious);
    
    // Subtract deductions after tax loss
    taxBase = Math.max(0, taxBase - otherDeductionsAfterLoss);

    // Determine tax rate
    let taxRate = 0;
    if (isNaturalPerson) {
      if (taxableRevenues <= 49790) {
        taxRate = 0.15;  // 15%
      } else if (taxBase <= 41445.46) {
        taxRate = 0.19;  // 19%
      } else {
        taxRate = 0.25;  // 25%
      }
    } else {
      taxRate = taxableRevenues <= 49790 ? 0.15 : 0.21;  // 15% or 21%
    }

    // Calculate final tax
    const tax = taxBase > 0 ? taxBase * taxRate : 0;

    setTaxValues({
      accountingResult,
      taxAdjustments,
      taxableRevenues,
      initialTaxBase: accountingResult + taxAdjustments,
      finalTaxBase: taxBase,
      taxRate,
      tax
    });
  }, [transactions, nonTaxableRevenues, isNaturalPerson, otherDeductionsBeforeLoss, taxLossFromPrevious, otherDeductionsAfterLoss]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Výpočet dane z príjmov</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Entity Type Toggle */}
          <div className="flex items-center space-x-4">
            <Label>Daňovník:</Label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={isNaturalPerson}
                onCheckedChange={setIsNaturalPerson}
              />
              <Label>{isNaturalPerson ? 'Fyzická osoba' : 'Právnická osoba'}</Label>
            </div>
          </div>

          {/* Step by Step Calculation */}
          <div className="space-y-4">
            {/* Initial Values */}
            <div className="grid grid-cols-2 gap-x-4 items-center">
              <Label>Výsledok hospodárenia pred zdanením:</Label>
              <span className="font-medium">{formatCurrency(taxValues.accountingResult)}</span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 items-center">
              <Label>Položky upravujúce základ dane (OP/PP):</Label>
              <span className="font-medium">{formatCurrency(taxValues.taxAdjustments)}</span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 items-center">
              <Label>Medzisúčet:</Label>
              <span className="font-medium">{formatCurrency(taxValues.initialTaxBase)}</span>
            </div>

            {/* Deductions Before Tax Loss */}
            <div className="grid grid-cols-2 gap-x-4 items-center">
              <div>
                <Label>Odpočítateľné položky pred daňovou stratou:</Label>
                <Input
                  type="number"
                  value={otherDeductionsBeforeLoss}
                  onChange={(e) => setOtherDeductionsBeforeLoss(parseFloat(e.target.value) || 0)}
                  step="0.01"
                  className="mt-1"
                />
              </div>
              <span className="font-medium text-red-600">
                {formatCurrency(-otherDeductionsBeforeLoss)}
              </span>
            </div>

            {/* Tax Loss */}
            <div className="grid grid-cols-2 gap-x-4 items-center">
              <div>
                <Label>Daňová strata z minulých období:</Label>
                <Input
                  type="number"
                  value={taxLossFromPrevious}
                  onChange={(e) => setTaxLossFromPrevious(parseFloat(e.target.value) || 0)}
                  step="0.01"
                  className="mt-1"
                />
              </div>
              <span className="font-medium text-red-600">
                {formatCurrency(-Math.min(taxLossFromPrevious, 
                  Math.max(0, taxValues.initialTaxBase - otherDeductionsBeforeLoss)))}
              </span>
            </div>

            {/* Deductions After Tax Loss */}
            <div className="grid grid-cols-2 gap-x-4 items-center">
              <div>
                <Label>Odpočítateľné položky po daňovej strate:</Label>
                <Input
                  type="number"
                  value={otherDeductionsAfterLoss}
                  onChange={(e) => setOtherDeductionsAfterLoss(parseFloat(e.target.value) || 0)}
                  step="0.01"
                  className="mt-1"
                />
              </div>
              <span className="font-medium text-red-600">
                {formatCurrency(-otherDeductionsAfterLoss)}
              </span>
            </div>

            {/* Final Tax Base */}
            <div className="grid grid-cols-2 gap-x-4 items-center pt-4 border-t">
              <Label>Upravený základ dane:</Label>
              <span className="font-medium">{formatCurrency(taxValues.finalTaxBase)}</span>
            </div>

            {/* Tax Rate Explanation */}
            <div className="grid grid-cols-2 gap-x-4 items-center">
              <Label>Zdaniteľné výnosy:</Label>
              <span className="font-medium">{formatCurrency(taxValues.taxableRevenues)}</span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 items-center">
              <Label>Sadzba dane:</Label>
              <span className="font-medium">{(taxValues.taxRate * 100).toFixed(0)}%</span>
            </div>

            {/* Final Tax */}
            <div className="grid grid-cols-2 gap-x-4 items-center pt-4 border-t">
              <Label>Daň z príjmov:</Label>
              <span className="font-bold text-lg">{formatCurrency(taxValues.tax)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxCalculation;
