import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Wallet, Plus, Minus, IndianRupee, CreditCard, Banknote } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const CashManagement = ({ cashInHand, onCashUpdate }) => {
  const [adjustmentAmount, setAdjustmentAmount] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const { toast } = useToast();

  const handleCashAdjustment = (type) => {
    if (!adjustmentAmount || parseFloat(adjustmentAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(adjustmentAmount);
    const newCashAmount = type === 'add' 
      ? cashInHand + amount 
      : cashInHand - amount;

    if (newCashAmount < 0) {
      toast({
        title: "Insufficient Cash",
        description: "Cash in hand cannot be negative",
        variant: "destructive",
      });
      return;
    }

    onCashUpdate(newCashAmount);
    
    toast({
      title: "Cash Updated",
      description: `₹${amount.toFixed(2)} ${type === 'add' ? 'added to' : 'removed from'} cash in hand`,
    });

    setAdjustmentAmount('');
    setAdjustmentReason('');
  };

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Wallet className="w-6 h-6" />
          Cash Management
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Current Cash Display */}
        <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-green-700">Cash in Hand:</span>
            <div className="flex items-center gap-1">
              <IndianRupee className="w-6 h-6 text-green-600" />
              <span className="text-3xl font-bold text-green-600">
                {cashInHand.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Cash Adjustment */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">Adjust Cash</h3>
          
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="adjustment-amount" className="text-sm font-medium text-slate-700">
                Amount (₹)
              </Label>
              <Input
                id="adjustment-amount"
                type="number"
                step="0.01"
                value={adjustmentAmount}
                onChange={(e) => setAdjustmentAmount(e.target.value)}
                placeholder="0.00"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adjustment-reason" className="text-sm font-medium text-slate-700">
                Reason (Optional)
              </Label>
              <Input
                id="adjustment-reason"
                type="text"
                value={adjustmentReason}
                onChange={(e) => setAdjustmentReason(e.target.value)}
                placeholder="e.g., Opening balance, Card payment, etc."
                className="h-12"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button 
                onClick={() => handleCashAdjustment('add')}
                className="h-12 bg-green-600 hover:bg-green-700 text-white font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Cash
              </Button>
              <Button 
                onClick={() => handleCashAdjustment('subtract')}
                variant="outline"
                className="h-12 border-red-300 text-red-600 hover:bg-red-50"
              >
                <Minus className="w-4 h-4 mr-2" />
                Remove Cash
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* Quick Actions */}
        <div className="space-y-3">
          <h4 className="text-md font-medium text-slate-700">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <Badge variant="outline" className="justify-center p-3 cursor-pointer hover:bg-blue-50">
              <CreditCard className="w-4 h-4 mr-2" />
              Card Payment
            </Badge>
            <Badge variant="outline" className="justify-center p-3 cursor-pointer hover:bg-green-50">
              <Banknote className="w-4 h-4 mr-2" />
              Cash Payment
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CashManagement;