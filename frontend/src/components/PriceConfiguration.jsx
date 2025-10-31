import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
// ScrollArea import removed as no longer needed
import { 
  IndianRupee,
  Save,
  RotateCcw,
  Fuel,
  Calendar
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const PriceConfiguration = ({ 
  isDarkMode, 
  fuelSettings, 
  updateFuelRate, 
  selectedDate,
  salesData,
  creditData,
  incomeData,
  expenseData
}) => {
  const [tempPrices, setTempPrices] = useState({});
  
  const { toast } = useToast();

  // Load date-specific rates when selectedDate changes
  React.useEffect(() => {
    const localStorageService = require('../services/localStorage').default;
    const dateSpecificRates = localStorageService.getRatesForDate(selectedDate);
    
    const prices = {};
    Object.entries(fuelSettings).forEach(([fuelType, config]) => {
      // Priority: 1. Date-specific rate 2. Last changed rate 3. Global setting
      let rateToUse = config.price;
      
      if (dateSpecificRates[fuelType] !== undefined) {
        // Use date-specific rate if it exists
        rateToUse = dateSpecificRates[fuelType];
      } else {
        // If no date-specific rate, use last changed rate from previous dates
        const lastChangedRate = localStorageService.getLastChangedRate(fuelType, selectedDate);
        if (lastChangedRate !== null) {
          rateToUse = lastChangedRate;
        }
      }
      
      prices[fuelType] = rateToUse.toString();
    });
    setTempPrices(prices);
  }, [selectedDate, fuelSettings]);

  const updateTempPrice = (fuelType, price) => {
    setTempPrices(prev => ({
      ...prev,
      [fuelType]: price
    }));
  };

  const savePrices = async () => {
    let hasChanges = false;
    let hasErrors = false;
    let updatedFuelTypes = [];
    
    // Get current date-specific rates for comparison
    const localStorageService = require('../services/localStorage').default;
    const currentDateRates = localStorageService.getRatesForDate(selectedDate);
    
    // Validate all prices first
    Object.entries(tempPrices).forEach(([fuelType, priceStr]) => {
      const price = parseFloat(priceStr);
      if (isNaN(price) || price <= 0) {
        hasErrors = true;
        return;
      }
      
      // Check if price is different from current date-specific rate
      const currentRate = currentDateRates[fuelType] || (fuelSettings[fuelType] && fuelSettings[fuelType].price);
      if (currentRate !== price) {
        hasChanges = true;
        updatedFuelTypes.push({ fuelType, price });
      }
    });
    
    if (hasErrors) {
      toast({
        title: "Invalid Prices",
        description: "Please enter valid prices (greater than 0) for all fuel types",
        variant: "destructive",
      });
      return;
    }
    
    if (!hasChanges) {
      toast({
        title: "No Changes",
        description: "Prices are already up to date",
      });
      return;
    }

    try {
      // Update each fuel type rate for the selected date
      for (const { fuelType, price } of updatedFuelTypes) {
        await updateFuelRate(fuelType, price, selectedDate);
      }
      
      // Rate updated silently - no toast notification
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to save fuel rates. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetPrices = () => {
    const resetPrices = {};
    Object.entries(fuelSettings).forEach(([fuelType, config]) => {
      resetPrices[fuelType] = config.price.toString();
    });
    setTempPrices(resetPrices);
    
    toast({
      title: "Rate Reset",
      description: "Rates have been reset to current values",
    });
  };

  const applyQuickPriceChange = (percentage) => {
    const newPrices = {};
    Object.entries(fuelSettings).forEach(([fuelType, config]) => {
      const newPrice = config.price * (1 + percentage / 100);
      newPrices[fuelType] = newPrice.toFixed(2);
    });
    setTempPrices(newPrices);
    
    toast({
      title: "Quick Rate Update",
      description: `Applied ${percentage > 0 ? '+' : ''}${percentage}% change to all rates`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Configuration Form */}
        <Card className={`${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
        } shadow-lg`}>
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="w-5 h-5" />
              Rate Configuration for {selectedDate}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Quick Price Actions */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Quick Rate Adjustments</Label>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyQuickPriceChange(2)}
                    className="text-green-600 border-green-300 hover:bg-green-50"
                  >
                    +2%
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyQuickPriceChange(5)}
                    className="text-green-600 border-green-300 hover:bg-green-50"
                  >
                    +5%
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyQuickPriceChange(-2)}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    -2%
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyQuickPriceChange(-5)}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    -5%
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Individual Fuel Price Settings */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Fuel Rate (₹ per Liter)</Label>
                {Object.entries(fuelSettings).map(([fuelType, config]) => (
                  <div key={fuelType} className={`border rounded-lg p-4 ${
                    isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-slate-200 bg-slate-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800 border-0">
                          {fuelType}
                        </Badge>
                        <span className="text-sm text-slate-600">
                          {config.nozzleCount} nozzle{config.nozzleCount > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">
                        Current: ₹{config.price}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium min-w-0">New Rate:</Label>
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-4 h-4 text-slate-500" />
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={tempPrices[fuelType] || ''}
                          onChange={(e) => updateTempPrice(fuelType, e.target.value)}
                          placeholder="0.00"
                          className="w-24"
                        />
                        <span className="text-sm text-slate-500"></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button onClick={savePrices} className="flex-1 bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Rate
                </Button>
                <Button variant="outline" onClick={resetPrices}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Rate Summary removed per user request */}
      </div>
    </div>
  );
};

export default PriceConfiguration;