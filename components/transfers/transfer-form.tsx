import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useExchangeRates } from '@/hooks/use-exchange-rates';
import { toast } from '@/components/ui/use-toast';

export function TransferForm() {
  const { t } = useLanguage();
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [exchangeRate, setExchangeRate] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const [accounts, setAccounts] = useState<{ id: string; name: string; currency: string }[]>([]);
  const { rates } = useExchangeRates();

  useEffect(() => {
    // Mock accounts - in a real app, this would fetch from API
    setAccounts([
      { id: '1', name: 'Main Account', currency: 'USD' },
      { id: '2', name: 'Savings', currency: 'EUR' },
      { id: '3', name: 'Investment', currency: 'USD' },
    ]);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!fromAccount || !toAccount || !amount || parseFloat(amount) <= 0) {
      toast({
        title: t('validationError'),
        description: t('pleaseCompleteAllFields'),
        variant: 'destructive',
      });
      return;
    }

    if (fromAccount === toAccount) {
      toast({
        title: t('validationError'),
        description: t('cannotTransferToSameAccount'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Logic to handle transfer submission would go here
      // await transferService.createTransfer({ fromAccount, toAccount, amount, exchangeRate });
      
      toast({
        title: t('transferSuccess'),
        description: t('transferProcessed'),
      });
      
      // Reset form
      setAmount('');
      setExchangeRate('1');
    } catch (error) {
      toast({
        title: t('transferError'),
        description: (error instanceof Error ? error.message : t('transferErrorGeneric')),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update exchange rate when accounts change
  useEffect(() => {
    if (fromAccount && toAccount && fromAccount !== toAccount) {
      const fromCurrency = accounts.find(acc => acc.id === fromAccount)?.currency;
      const toCurrency = accounts.find(acc => acc.id === toAccount)?.currency;
      
      if (fromCurrency && toCurrency && fromCurrency !== toCurrency && rates) {
        // Simple conversion using the rates from our hook
        if (rates[fromCurrency] && rates[toCurrency]) {
          const rate = rates[toCurrency] / rates[fromCurrency];
          setExchangeRate(rate.toFixed(4));
        }
      } else {
        setExchangeRate('1');
      }
    }
  }, [fromAccount, toAccount, accounts, rates]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fromAccount">{t('fromAccount')}</Label>
        <Select 
          value={fromAccount} 
          onValueChange={setFromAccount}
        >
          <SelectTrigger id="fromAccount">
            <SelectValue placeholder={t('selectAccount')} />
          </SelectTrigger>
          <SelectContent>
            {accounts.map(account => (
              <SelectItem key={account.id} value={account.id}>
                {account.name} ({account.currency})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="toAccount">{t('toAccount')}</Label>
        <Select 
          value={toAccount} 
          onValueChange={setToAccount}
        >
          <SelectTrigger id="toAccount">
            <SelectValue placeholder={t('selectAccount')} />
          </SelectTrigger>
          <SelectContent>
            {accounts.map(account => (
              <SelectItem key={account.id} value={account.id}>
                {account.name} ({account.currency})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="amount">{t('amount')}</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="exchangeRate">{t('exchangeRate')}</Label>
        <Input
          id="exchangeRate"
          type="number"
          step="0.0001"
          min="0.0001"
          value={exchangeRate}
          onChange={(e) => setExchangeRate(e.target.value)}
          required
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? t('processing') : t('transfer')}
      </Button>
    </form>
  );
}
