import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  Settings as SettingsIcon,
  Fuel,
  Plus,
  Minus,
  Trash2,
  Save,
  RotateCcw,
  IndianRupee,
  Gauge
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const FuelSettings = ({ isDarkMode, fuelSettings, setFuelSettings }) => {
  const [newFuelType, setNewFuelType] = useState('');
  const [newFuelPrice, setNewFuelPrice] = useState('');
  const { toast } = useToast();

  const updateNozzleCount = (fuelType, delta) => {
    setFuelSettings(prev => ({
      ...prev,
      [fuelType]: {
        ...prev[fuelType],
        nozzleCount: Math.max(1, Math.min(10, prev[fuelType].nozzleCount + delta))
      }
    }));
  };

  const updateFuelPrice = (fuelType, price) => {
    setFuelSettings(prev => ({
      ...prev,
      [fuelType]: {
        ...prev[fuelType],
        price: parseFloat(price) || 0
      }
    }));
  };

  const addFuelType = () => {
    if (!newFuelType.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a fuel type name",
        variant: "destructive",
      });
      return;
    }

    if (fuelSettings[newFuelType]) {
      toast({
        title: "Duplicate Fuel Type",
        description: "This fuel type already exists",
        variant: "destructive",
      });
      return;
    }

    setFuelSettings(prev => ({
      ...prev,
      [newFuelType]: {
        price: parseFloat(newFuelPrice) || 100,
        nozzleCount: 2
      }
    }));

    setNewFuelType('');
    setNewFuelPrice('');
    
    toast({
      title: "Fuel Type Added",
      description: `${newFuelType} has been added successfully`,
    });
  };

  const removeFuelType = (fuelType) => {
    const newSettings = { ...fuelSettings };
    delete newSettings[fuelType];
    setFuelSettings(newSettings);
    
    toast({
      title: "Fuel Type Removed",
      description: `${fuelType} has been removed`,
    });
  };

  const resetToDefaults = () => {
    const defaultSettings = {
      'Petrol': { price: 102.50, nozzleCount: 3 },
      'Diesel': { price: 89.75, nozzleCount: 2 },
      'CNG': { price: 75.20, nozzleCount: 2 },
      'Premium': { price: 108.90, nozzleCount: 1 }
    };
    setFuelSettings(defaultSettings);
    
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to defaults",
    });
  };

  const generateNozzleList = (fuelType, count) => {
    const nozzles = [];
    // Special naming for specific fuel types
    let prefix;
    if (fuelType.toLowerCase() === 'power') {
      prefix = 'PO';
    } else if (fuelType.toLowerCase() === 'premium') {
      prefix = 'PR';
    } else {
      prefix = fuelType.charAt(0).toUpperCase();
    }
    
    for (let i = 1; i <= count; i++) {
      nozzles.push(`${prefix}${i}`);
    }
    return nozzles;
  };

  const getTotalNozzles = () => {
    return Object.values(fuelSettings).reduce((total, config) => total + config.nozzleCount, 0);
  };

  const getAveragePrice = () => {
    const prices = Object.values(fuelSettings).map(config => config.price);
    return prices.length > 0 ? (prices.reduce((sum, price) => sum + price, 0) / prices.length).toFixed(2) : 0;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={`${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
        } shadow-lg`}>
          <CardContent className="p-4 text-center">
            <Fuel className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
              Fuel Types
            </p>
            <p className="text-2xl font-bold text-blue-600">
              {Object.keys(fuelSettings).length}
            </p>
          </CardContent>
        </Card>

        <Card className={`${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
        } shadow-lg`}>
          <CardContent className="p-4 text-center">
            <Gauge className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
              Total Nozzles
            </p>
            <p className="text-2xl font-bold text-green-600">
              {getTotalNozzles()}
            </p>
          </CardContent>
        </Card>

        <Card className={`${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
        } shadow-lg`}>
          <CardContent className="p-4 text-center">
            <IndianRupee className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
              Avg. Price/L
            </p>
            <p className="text-2xl font-bold text-orange-600">
              ₹{getAveragePrice()}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fuel Types Configuration */}
        <Card className={`${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
        } shadow-lg`}>
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Fuel className="w-5 h-5" />
              Fuel Type Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="p-4 space-y-4">
                {Object.entries(fuelSettings).map(([fuelType, config]) => (
                  <div key={fuelType} className={`border rounded-lg p-4 ${
                    isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-slate-200 bg-slate-50'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Fuel className="w-4 h-4 text-blue-600" />
                        <span className={`font-medium ${
                          isDarkMode ? 'text-white' : 'text-slate-800'
                        }`}>
                          {fuelType}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFuelType(fuelType)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label className={`text-sm font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-slate-600'
                        }`}>
                          Price per Liter (₹)
                        </Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={config.price}
                          onChange={(e) => updateFuelPrice(fuelType, e.target.value)}
                          className="h-10"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className={`text-sm font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-slate-600'
                        }`}>
                          Number of Nozzles (1-10)
                        </Label>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateNozzleCount(fuelType, -1)}
                            disabled={config.nozzleCount <= 1}
                            className="h-10 w-10 p-0"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className={`font-bold text-xl min-w-[3rem] text-center ${
                            isDarkMode ? 'text-white' : 'text-slate-800'
                          }`}>
                            {config.nozzleCount}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateNozzleCount(fuelType, 1)}
                            disabled={config.nozzleCount >= 10}
                            className="h-10 w-10 p-0"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Nozzle Preview */}
                      <div className="space-y-2">
                        <Label className={`text-xs font-medium ${
                          isDarkMode ? 'text-gray-400' : 'text-slate-500'
                        }`}>
                          Nozzle IDs:
                        </Label>
                        <div className="flex flex-wrap gap-1">
                          {generateNozzleList(fuelType, config.nozzleCount).map((nozzleId) => (
                            <Badge 
                              key={nozzleId} 
                              variant="outline" 
                              className={`text-xs ${
                                isDarkMode ? 'border-gray-500 text-gray-300' : 'border-slate-300'
                              }`}
                            >
                              {nozzleId}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {Object.keys(fuelSettings).length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <Fuel className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No fuel types configured</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Add New Fuel Type */}
        <div className="space-y-6">
          <Card className={`${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
          } shadow-lg`}>
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add New Fuel Type
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-fuel-type" className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  Fuel Type Name
                </Label>
                <Input
                  id="new-fuel-type"
                  type="text"
                  value={newFuelType}
                  onChange={(e) => setNewFuelType(e.target.value)}
                  placeholder="e.g., Electric, Bio-Diesel, etc."
                  className="h-12"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-fuel-price" className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  Price per Liter (₹)
                </Label>
                <Input
                  id="new-fuel-price"
                  type="number"
                  step="0.01"
                  value={newFuelPrice}
                  onChange={(e) => setNewFuelPrice(e.target.value)}
                  placeholder="100.00"
                  className="h-12"
                />
              </div>
              
              <Button 
                onClick={addFuelType}
                className="w-full h-12 bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Fuel Type
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className={`${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
          } shadow-lg`}>
            <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Button 
                onClick={resetToDefaults}
                variant="outline"
                className="w-full h-12 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset to Defaults
              </Button>

              <div className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-slate-50'
              }`}>
                <h4 className={`font-medium mb-2 ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`}>
                  Current Configuration:
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-slate-600'}>
                      Fuel Types:
                    </span>
                    <span className={isDarkMode ? 'text-white' : 'text-slate-800'}>
                      {Object.keys(fuelSettings).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-slate-600'}>
                      Total Nozzles:
                    </span>
                    <span className={isDarkMode ? 'text-white' : 'text-slate-800'}>
                      {getTotalNozzles()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-slate-600'}>
                      Price Range:
                    </span>
                    <span className={isDarkMode ? 'text-white' : 'text-slate-800'}>
                      ₹{Math.min(...Object.values(fuelSettings).map(c => c.price)).toFixed(2)} - 
                      ₹{Math.max(...Object.values(fuelSettings).map(c => c.price)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className={`p-3 rounded-lg ${
                isDarkMode ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'
              }`}>
                <p className="text-sm text-blue-600">
                  💡 Settings are automatically saved when you make changes. 
                  Changes will reflect immediately in Sales and Credit sections.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FuelSettings;