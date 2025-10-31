import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Fuel, Calculator, Receipt, RotateCcw, IndianRupee, Droplets, Gauge, Edit3, CreditCard, Banknote, Wallet, Plus, Minus, Settings as SettingsIcon } from 'lucide-react';
import TransactionHistory from './TransactionHistory';
import CashManagement from './CashManagement';
import Settings from './Settings';
import { useToast } from '../hooks/use-toast';
import { mockData } from '../utils/mockData';

const PetrolPumpCalculator = () => {
  const [fuelType, setFuelType] = useState('');
  const [pricePerLiter, setPricePerLiter] = useState('');
  const [quantity, setQuantity] = useState('');
  const [totalCost, setTotalCost] = useState(0);
  const [amountReceived, setAmountReceived] = useState('');
  const [changeAmount, setChangeAmount] = useState(0);
  const [transactions, setTransactions] = useState([]);
  
  // Meter reading states
  const [calculationMode, setCalculationMode] = useState('manual'); // 'manual' or 'meter'
  const [initialReading, setInitialReading] = useState('');
  const [finalReading, setFinalReading] = useState('');
  
  // Nozzle and payment states
  const [selectedNozzle, setSelectedNozzle] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' or 'card'
  const [cashInHand, setCashInHand] = useState(0);
  
  // Settings states
  const [fuelSettings, setFuelSettings] = useState({});
  const [nozzleReadings, setNozzleReadings] = useState({});
  const [showSettings, setShowSettings] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    // Load mock data on component mount
    setTransactions(mockData.transactions);
    setCashInHand(mockData.cashInHand);
    setFuelSettings(mockData.fuelSettings);
    setNozzleReadings(mockData.nozzleReadings);
  }, []);

  // Generate fuel types array from settings
  const generateFuelTypes = () => {
    return Object.entries(fuelSettings).map(([type, config]) => ({
      type,
      price: config.price,
      nozzles: generateNozzles(type, config.nozzleCount)
    }));
  };

  // Generate nozzles for a fuel type
  const generateNozzles = (fuelType, count) => {
    const nozzles = [];
    const prefix = fuelType.charAt(0).toUpperCase();
    
    for (let i = 1; i <= count; i++) {
      const nozzleId = `${prefix}${i}`;
      nozzles.push({
        id: nozzleId,
        name: `Nozzle ${nozzleId}`,
        currentReading: nozzleReadings[nozzleId] || Math.floor(Math.random() * 2000) + 500
      });
    }
    return nozzles;
  };

  useEffect(() => {
    let calculatedQuantity = 0;
    
    if (calculationMode === 'manual' && quantity) {
      calculatedQuantity = parseFloat(quantity);
    } else if (calculationMode === 'meter' && initialReading && finalReading) {
      const initial = parseFloat(initialReading);
      const final = parseFloat(finalReading);
      if (final > initial) {
        calculatedQuantity = final - initial;
        setQuantity(calculatedQuantity.toFixed(2));
      }
    }
    
    if (pricePerLiter && calculatedQuantity > 0) {
      const total = parseFloat(pricePerLiter) * calculatedQuantity;
      setTotalCost(total);
    } else {
      setTotalCost(0);
    }
  }, [pricePerLiter, quantity, calculationMode, initialReading, finalReading]);

  useEffect(() => {
    if (amountReceived && totalCost) {
      const change = parseFloat(amountReceived) - totalCost;
      setChangeAmount(change > 0 ? change : 0);
    } else {
      setChangeAmount(0);
    }
  }, [amountReceived, totalCost]);

  const handleFuelTypeChange = (value) => {
    setFuelType(value);
    setSelectedNozzle(''); // Reset nozzle selection
    if (fuelSettings[value]) {
      setPricePerLiter(fuelSettings[value].price.toString());
    }
  };

  const handleNozzleChange = (nozzleId) => {
    setSelectedNozzle(nozzleId);
    if (calculationMode === 'meter' && nozzleReadings[nozzleId]) {
      setInitialReading(nozzleReadings[nozzleId].toString());
    }
  };

  const handleSettingsUpdate = (newSettings) => {
    setFuelSettings(newSettings);
    
    // Generate new nozzle readings for any new nozzles
    const newReadings = { ...nozzleReadings };
    Object.entries(newSettings).forEach(([fuelType, config]) => {
      const prefix = fuelType.charAt(0).toUpperCase();
      for (let i = 1; i <= config.nozzleCount; i++) {
        const nozzleId = `${prefix}${i}`;
        if (!newReadings[nozzleId]) {
          newReadings[nozzleId] = Math.floor(Math.random() * 2000) + 500;
        }
      }
    });
    setNozzleReadings(newReadings);
    
    // Reset selections if current fuel type was removed
    if (!newSettings[fuelType]) {
      setFuelType('');
      setSelectedNozzle('');
      setPricePerLiter('');
    }
  };

  const handleTransaction = () => {
    let calculatedQuantity = 0;
    
    if (calculationMode === 'manual') {
      if (!quantity) {
        toast({
          title: "Incomplete Information",
          description: "Please enter quantity",
          variant: "destructive",
        });
        return;
      }
      calculatedQuantity = parseFloat(quantity);
    } else if (calculationMode === 'meter') {
      if (!initialReading || !finalReading) {
        toast({
          title: "Incomplete Information",
          description: "Please enter both initial and final meter readings",
          variant: "destructive",
        });
        return;
      }
      const initial = parseFloat(initialReading);
      const final = parseFloat(finalReading);
      if (final <= initial) {
        toast({
          title: "Invalid Reading",
          description: "Final reading must be greater than initial reading",
          variant: "destructive",
        });
        return;
      }
      calculatedQuantity = final - initial;
    }

    if (!fuelType || !selectedNozzle || !amountReceived) {
      toast({
        title: "Incomplete Information",
        description: "Please select fuel type, nozzle, and enter payment amount",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(amountReceived) < totalCost) {
      toast({
        title: "Insufficient Payment",
        description: "Amount received is less than total cost",
        variant: "destructive",
      });
      return;
    }

    const newTransaction = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      fuelType,
      quantity: calculatedQuantity,
      pricePerLiter: parseFloat(pricePerLiter),
      totalCost,
      amountReceived: parseFloat(amountReceived),
      changeAmount,
      calculationMode,
      paymentMethod,
      nozzleId: selectedNozzle,
      ...(calculationMode === 'meter' && {
        initialReading: parseFloat(initialReading),
        finalReading: parseFloat(finalReading)
      })
    };

    setTransactions([newTransaction, ...transactions]);
    
    // Update cash in hand based on payment method
    if (paymentMethod === 'cash') {
      setCashInHand(prev => prev + parseFloat(amountReceived) - changeAmount);
    }
    // Note: Card payments don't add to cash in hand
    
    toast({
      title: "Transaction Completed",
      description: `₹${totalCost.toFixed(2)} ${paymentMethod} transaction processed successfully`,
    });

    // Reset form
    handleReset();
  };

  const handleReset = () => {
    setFuelType('');
    setPricePerLiter('');
    setQuantity('');
    setTotalCost(0);
    setAmountReceived('');
    setChangeAmount(0);
    setInitialReading('');
    setFinalReading('');
    setSelectedNozzle('');
    setPaymentMethod('cash');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Fuel className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-800">FuelCalc Pro</h1>
            <Button
              variant="outline"
              onClick={() => setShowSettings(!showSettings)}
              className="ml-4 flex items-center gap-2"
            >
              <SettingsIcon className="w-4 h-4" />
              Settings
            </Button>
          </div>
          <p className="text-slate-600 text-lg">Professional Petrol Pump Calculator</p>
        </div>

        {/* Settings Section */}
        {showSettings && (
          <div className="mb-6">
            <Settings 
              fuelSettings={fuelSettings} 
              onSettingsUpdate={handleSettingsUpdate}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Calculator */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Calculator className="w-6 h-6" />
                  Fuel Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Fuel Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fuelType" className="text-sm font-medium text-slate-700">
                      Fuel Type
                    </Label>
                    <Select value={fuelType} onValueChange={handleFuelTypeChange}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(fuelSettings).map(([type, config]) => (
                          <SelectItem key={type} value={type}>
                            {type} - ₹{config.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-sm font-medium text-slate-700">
                      Price per Liter (₹)
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={pricePerLiter}
                      onChange={(e) => setPricePerLiter(e.target.value)}
                      placeholder="0.00"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nozzle" className="text-sm font-medium text-slate-700">
                      Select Nozzle
                    </Label>
                    <Select 
                      value={selectedNozzle} 
                      onValueChange={handleNozzleChange}
                      disabled={!fuelType}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder={fuelType ? "Select nozzle" : "Select fuel type first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {fuelType && generateNozzles(fuelType, fuelSettings[fuelType]?.nozzleCount || 0).map((nozzle) => (
                          <SelectItem key={nozzle.id} value={nozzle.id}>
                            <div className="flex items-center gap-2">
                              <Gauge className="w-4 h-4" />
                              {nozzle.name} ({nozzle.currentReading})
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Quantity Calculation Mode */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-slate-700">
                    Quantity Calculation
                  </Label>
                  
                  <Tabs value={calculationMode} onValueChange={setCalculationMode} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 h-12">
                      <TabsTrigger value="manual" className="flex items-center gap-2">
                        <Edit3 className="w-4 h-4" />
                        Manual Entry
                      </TabsTrigger>
                      <TabsTrigger value="meter" className="flex items-center gap-2">
                        <Gauge className="w-4 h-4" />
                        Meter Reading
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="manual" className="space-y-2 mt-4">
                      <Label htmlFor="quantity" className="text-sm font-medium text-slate-600">
                        Enter Quantity (Liters)
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        step="0.01"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="0.00"
                        className="h-12 text-lg"
                      />
                    </TabsContent>
                    
                    <TabsContent value="meter" className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="initial-reading" className="text-sm font-medium text-slate-600">
                            Initial Reading (L)
                          </Label>
                          <Input
                            id="initial-reading"
                            type="number"
                            step="0.01"
                            value={initialReading}
                            onChange={(e) => setInitialReading(e.target.value)}
                            placeholder="0.00"
                            className="h-12"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="final-reading" className="text-sm font-medium text-slate-600">
                            Final Reading (L)
                          </Label>
                          <Input
                            id="final-reading"
                            type="number"
                            step="0.01"
                            value={finalReading}
                            onChange={(e) => setFinalReading(e.target.value)}
                            placeholder="0.00"
                            className="h-12"
                          />
                        </div>
                      </div>
                      
                      {initialReading && finalReading && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-blue-700">Calculated Quantity:</span>
                            <div className="flex items-center gap-1">
                              <Droplets className="w-4 h-4 text-blue-600" />
                              <span className="font-semibold text-blue-800">
                                {(parseFloat(finalReading) - parseFloat(initialReading)).toFixed(2)} L
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Total Cost Display */}
                <div className="bg-slate-50 rounded-lg p-4 border-2 border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-slate-700">Total Cost:</span>
                    <div className="flex items-center gap-1">
                      <IndianRupee className="w-6 h-6 text-green-600" />
                      <span className="text-3xl font-bold text-green-600">
                        {totalCost.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Payment Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <Receipt className="w-5 h-5" />
                    Payment Details
                  </h3>
                  
                  {/* Payment Method Selection */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">
                      Payment Method
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                        onClick={() => setPaymentMethod('cash')}
                        className="h-12 flex items-center gap-2"
                      >
                        <Banknote className="w-4 h-4" />
                        Cash
                      </Button>
                      <Button
                        type="button"
                        variant={paymentMethod === 'card' ? 'default' : 'outline'}
                        onClick={() => setPaymentMethod('card')}
                        className="h-12 flex items-center gap-2"
                      >
                        <CreditCard className="w-4 h-4" />
                        Card
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="received" className="text-sm font-medium text-slate-700">
                        {paymentMethod === 'cash' ? 'Cash Received (₹)' : 'Card Payment (₹)'}
                      </Label>
                      <Input
                        id="received"
                        type="number"
                        step="0.01"
                        value={amountReceived}
                        onChange={(e) => setAmountReceived(e.target.value)}
                        placeholder="0.00"
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">
                        {paymentMethod === 'cash' ? 'Change to Return' : 'Card Status'}
                      </Label>
                      <div className="h-12 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md flex items-center">
                        {paymentMethod === 'cash' ? (
                          <div className="flex items-center gap-1">
                            <IndianRupee className="w-4 h-4 text-orange-600" />
                            <span className="text-lg font-semibold text-orange-600">
                              {changeAmount.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-blue-600">
                              {parseFloat(amountReceived || 0) >= totalCost ? 'Payment Complete' : 'Pending Payment'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleTransaction}
                    className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white font-medium"
                  >
                    Complete Transaction
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleReset}
                    className="h-12 px-6 border-slate-300 hover:bg-slate-50"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cash Management */}
          <div className="lg:col-span-1">
            <CashManagement 
              cashInHand={cashInHand} 
              onCashUpdate={setCashInHand} 
            />
          </div>

          {/* Transaction History */}
          <div className="lg:col-span-1">
            <TransactionHistory transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetrolPumpCalculator;