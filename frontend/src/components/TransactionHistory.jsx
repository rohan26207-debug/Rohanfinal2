import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { History, IndianRupee, Fuel, Gauge, CreditCard, Banknote } from 'lucide-react';

const TransactionHistory = ({ transactions }) => {
  const getTotalSales = () => {
    return transactions.reduce((total, transaction) => total + transaction.totalCost, 0);
  };

  const getFuelTypeColor = (fuelType) => {
    const colors = {
      'Petrol': 'bg-blue-100 text-blue-800',
      'Diesel': 'bg-green-100 text-green-800',
      'CNG': 'bg-purple-100 text-purple-800',
      'Premium': 'bg-orange-100 text-orange-800'
    };
    return colors[fuelType] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="shadow-lg border-0 bg-white h-fit">
      <CardHeader className="bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-xl">
          <History className="w-6 h-6" />
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Summary */}
        <div className="p-4 bg-slate-50 border-b">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Total Sales Today:</span>
            <div className="flex items-center gap-1">
              <IndianRupee className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-green-600">
                {getTotalSales().toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm text-slate-600">Transactions:</span>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {transactions.length}
            </Badge>
          </div>
        </div>

        {/* Transaction List */}
        <ScrollArea className="h-[500px]">
          <div className="p-4 space-y-3">
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Fuel className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No transactions yet</p>
              </div>
            ) : (
              transactions.map((transaction) => (
                <div key={transaction.id} className="bg-white border border-slate-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={`${getFuelTypeColor(transaction.fuelType)} border-0`}>
                        {transaction.fuelType}
                      </Badge>
                      {transaction.calculationMode === 'meter' && (
                        <Gauge className="w-3 h-3 text-blue-500" title="Meter Reading" />
                      )}
                      {transaction.paymentMethod === 'card' ? (
                        <CreditCard className="w-3 h-3 text-purple-500" title="Card Payment" />
                      ) : (
                        <Banknote className="w-3 h-3 text-green-500" title="Cash Payment" />
                      )}
                    </div>
                    <span className="text-xs text-slate-500">{transaction.timestamp}</span>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Quantity:</span>
                      <span className="font-medium">{transaction.quantity}L</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Nozzle:</span>
                      <span className="text-slate-500">{transaction.nozzleId}</span>
                    </div>
                    {transaction.calculationMode === 'meter' && (
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Meter:</span>
                        <span className="text-slate-500">
                          {transaction.initialReading}L → {transaction.finalReading}L
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-600">Rate:</span>
                      <span className="font-medium">₹{transaction.pricePerLiter}/L</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Payment:</span>
                      <span className="text-slate-500 capitalize">{transaction.paymentMethod}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-700">Total:</span>
                      <span className="text-green-600">₹{transaction.totalCost.toFixed(2)}</span>
                    </div>
                    {transaction.changeAmount > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">Change:</span>
                        <span className="text-orange-600">₹{transaction.changeAmount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;