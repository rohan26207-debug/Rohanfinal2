import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Settings as SettingsIcon, Plus, Minus, Fuel, Save, Trash2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Settings = ({ fuelSettings, onSettingsUpdate }) => {
  const [localSettings, setLocalSettings] = useState(fuelSettings);
  const [newFuelType, setNewFuelType] = useState('');
  const [newFuelPrice, setNewFuelPrice] = useState('');
  const { toast } = useToast();

  const updateNozzleCount = (fuelType, delta) => {
    setLocalSettings(prev => ({
      ...prev,
      [fuelType]: {
        ...prev[fuelType],
        nozzleCount: Math.max(1, Math.min(10, prev[fuelType].nozzleCount + delta))
      }
    }));
  };

  const updateFuelPrice = (fuelType, price) => {
    setLocalSettings(prev => ({
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

    if (localSettings[newFuelType]) {
      toast({
        title: "Duplicate Fuel Type",
        description: "This fuel type already exists",
        variant: "destructive",
      });
      return;
    }

    setLocalSettings(prev => ({
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
    const newSettings = { ...localSettings };
    delete newSettings[fuelType];
    setLocalSettings(newSettings);
    
    toast({
      title: "Fuel Type Removed",
      description: `${fuelType} has been removed`,
    });
  };

  const saveSettings = () => {
    onSettingsUpdate(localSettings);
    toast({
      title: "Settings Saved",
      description: "Fuel and nozzle settings have been updated",
    });
  };

  const generateNozzleList = (fuelType, count) => {
    const nozzles = [];
    for (let i = 1; i <= count; i++) {
      const prefix = fuelType.charAt(0).toUpperCase();
      nozzles.push(`${prefix}${i}`);
    }
    return nozzles;
  };

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-xl">
          <SettingsIcon className="w-6 h-6" />
          Pump Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Existing Fuel Types */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">Fuel Type Configuration</h3>
          
          {Object.entries(localSettings).map(([fuelType, config]) => (
            <div key={fuelType} className="bg-slate-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Fuel className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-slate-800">{fuelType}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeFuelType(fuelType)}
                  className="text-red-600 hover:bg-red-50 border-red-200"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-600">
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
                  <Label className="text-sm font-medium text-slate-600">
                    Number of Nozzles
                  </Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateNozzleCount(fuelType, -1)}
                      disabled={config.nozzleCount <= 1}
                      className="h-10 w-10 p-0"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="font-semibold text-lg min-w-[3rem] text-center">
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
              </div>
              
              {/* Nozzle Preview */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-slate-500">
                  Nozzle IDs Preview:
                </Label>
                <div className="flex flex-wrap gap-1">
                  {generateNozzleList(fuelType, config.nozzleCount).map((nozzleId) => (
                    <Badge key={nozzleId} variant="outline" className="text-xs">
                      {nozzleId}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Add New Fuel Type */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">Add New Fuel Type</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="new-fuel-type" className="text-sm font-medium text-slate-600">
                Fuel Type Name
              </Label>
              <Input
                id="new-fuel-type"
                type="text"
                value={newFuelType}
                onChange={(e) => setNewFuelType(e.target.value)}
                placeholder="e.g., Premium, Electric, etc."
                className="h-10"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-fuel-price" className="text-sm font-medium text-slate-600">
                Price per Liter (₹)
              </Label>
              <Input
                id="new-fuel-price"
                type="number"
                step="0.01"
                value={newFuelPrice}
                onChange={(e) => setNewFuelPrice(e.target.value)}
                placeholder="100.00"
                className="h-10"
              />
            </div>
          </div>
          
          <Button 
            onClick={addFuelType}
            className="w-full h-10 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Fuel Type
          </Button>
        </div>

        <Separator />

        {/* Save Settings */}
        <Button 
          onClick={saveSettings}
          className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium"
        >
          <Save className="w-4 h-4 mr-2" />
          Save All Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default Settings;