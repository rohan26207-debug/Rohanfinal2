import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { 
  CreditCard, 
  Plus, 
  Edit,
  Trash2,
  Users,
  IndianRupee,
  Calendar,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const CreditSales = ({ isDarkMode, creditData, addCreditRecord, updateCreditRecord, deleteCreditRecord, fuelSettings, selectedDate, salesData, incomeData, expenseData, formResetKey, editingRecord, onRecordSaved, hideRecordsList }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    vehicleNumber: '',
    fuelType: '',
    liters: '',
    rate: ''
  });
  const [editingId, setEditingId] = useState(null);
  const { toast } = useToast();

  // Generate fuel types with date-specific rates
  const fuelTypes = React.useMemo(() => {
    if (!fuelSettings) return [];
    
    const localStorageService = require('../services/localStorage').default;
    const dateSpecificRates = localStorageService.getRatesForDate(selectedDate);
    
    return Object.entries(fuelSettings).map(([type, config]) => {
      let rate = config.price;
      
      // Check for date-specific or last changed rate
      if (dateSpecificRates[type] !== undefined) {
        rate = dateSpecificRates[type];
      } else {
        const lastChangedRate = localStorageService.getLastChangedRate(type, selectedDate);
        if (lastChangedRate !== null) {
          rate = lastChangedRate;
        }
      }
      
      return {
        type,
        rate
      };
    });
  }, [fuelSettings, selectedDate]);

  // Pre-fill form when editingRecord is provided
  useEffect(() => {
    if (editingRecord) {
      setFormData({
        customerName: editingRecord.customerName || '',
        vehicleNumber: editingRecord.vehicleNumber || '',
        fuelType: editingRecord.fuelType || '',
        liters: editingRecord.liters?.toString() || '',
        rate: editingRecord.rate?.toString() || ''
      });
      setEditingId(editingRecord.id);
    } else {
      // Reset when editingRecord is null (adding new record)
      setEditingId(null);
    }
  }, [editingRecord]);

  // Reset form when date changes (formResetKey changes) - but NOT when editing
  useEffect(() => {
    // Don't reset form if we're editing a record
    if (!editingRecord && !editingId) {
      setFormData({
        customerName: '',
        vehicleNumber: '',
        fuelType: '',
        liters: '',
        rate: ''
      });
    }
  }, [formResetKey, editingRecord, editingId]);

  const handleFuelChange = (fuelType) => {
    const fuelConfig = fuelSettings[fuelType];
    
    // Get date-specific rate or last changed rate for this fuel type
    const localStorageService = require('../services/localStorage').default;
    const dateSpecificRates = localStorageService.getRatesForDate(selectedDate);
    
    let rateToUse = fuelConfig ? fuelConfig.price : '';
    
    // Check if there's a date-specific or last changed rate
    if (dateSpecificRates[fuelType] !== undefined) {
      rateToUse = dateSpecificRates[fuelType];
    } else {
      // If no date-specific rate, get last changed rate
      const lastChangedRate = localStorageService.getLastChangedRate(fuelType, selectedDate);
      if (lastChangedRate !== null) {
        rateToUse = lastChangedRate;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      fuelType,
      rate: rateToUse.toString()
    }));
  };

  const calculateAmount = () => {
    const { liters, rate } = formData;
    if (!liters || !rate) return 0;
    return (parseFloat(liters) * parseFloat(rate)).toFixed(2);
  };

  const handleSubmit = () => {
    if (!formData.customerName || !formData.fuelType || !formData.liters || !formData.rate) {
      return;
    }

    const creditRecord = {
      id: editingId || Date.now(),
      date: selectedDate,
      ...formData,
      liters: parseFloat(formData.liters),
      rate: parseFloat(formData.rate),
      amount: parseFloat(calculateAmount()),
      status: 'pending'
    };

    if (editingId) {
      // Update existing credit record
      if (updateCreditRecord) {
        updateCreditRecord(editingId, {
          customerName: formData.customerName,
          vehicleNumber: formData.vehicleNumber,
          fuelType: formData.fuelType,
          liters: parseFloat(formData.liters),
          rate: parseFloat(formData.rate),
          amount: parseFloat(calculateAmount()),
          status: 'pending'
        });
        setEditingId(null);
        resetForm();
        // Close dialog after updating
        if (onRecordSaved) onRecordSaved();
      }
    } else {
      const newCredit = addCreditRecord({
        customerName: formData.customerName,
        vehicleNumber: formData.vehicleNumber,
        fuelType: formData.fuelType,
        liters: parseFloat(formData.liters),
        rate: parseFloat(formData.rate),
        amount: parseFloat(calculateAmount()),
        status: 'pending'
      });
      
      if (newCredit) {
        resetForm();
        // Close dialog after adding
        if (onRecordSaved) onRecordSaved();
      }
    }
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      vehicleNumber: '',
      fuelType: '',
      liters: '',
      rate: ''
    });
    setEditingId(null);
  };

  const editCredit = (credit) => {
    setFormData({
      customerName: credit.customerName,
      vehicleNumber: credit.vehicleNumber || '',
      fuelType: credit.fuelType,
      liters: credit.liters.toString(),
      rate: credit.rate.toString()
    });
    setEditingId(credit.id);
  };

  const deleteCredit = (id) => {
    if (deleteCreditRecord) {
      deleteCreditRecord(id);
    }
  };

  // Filter credit data for the selected date
  const filteredCreditData = creditData.filter(credit => credit.date === selectedDate);

  return (
    <div className="space-y-6">
      <div className={hideRecordsList ? "" : "grid grid-cols-1 lg:grid-cols-2 gap-6"}>
        {/* Input Form */}
        <Card className={`${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
        } shadow-lg`}>
        <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            {editingId ? 'Edit Credit Sale' : 'Add Credit Sale'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Customer Name *</Label>
            <Input
              value={formData.customerName}
              onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
              placeholder="Enter customer name"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Vehicle Number</Label>
            <Input
              value={formData.vehicleNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, vehicleNumber: e.target.value }))}
              placeholder="e.g., MH 12 AB 1234"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Fuel Type *</Label>
            <Select key={`fuel-${editingId || 'new'}`} value={formData.fuelType} onValueChange={handleFuelChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select fuel type" />
              </SelectTrigger>
              <SelectContent>
                {fuelTypes.map(({ type, rate }) => (
                  <SelectItem key={type} value={type}>
                    {type} - ₹{rate}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Liters *</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.liters}
                onChange={(e) => setFormData(prev => ({ ...prev, liters: e.target.value }))}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Rate per Liter (₹) *</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.rate}
                onChange={(e) => setFormData(prev => ({ ...prev, rate: e.target.value }))}
                placeholder="0.00"
              />
            </div>
          </div>

          {formData.liters && formData.rate && (
            <div className={`bg-orange-50 border border-orange-200 rounded-lg p-4 ${
              isDarkMode ? 'bg-orange-900/20 border-orange-700' : ''
            }`}>
              <div className="text-center">
                <p className="text-sm text-orange-600">Total Amount</p>
                <div className="flex items-center justify-center gap-1">
                  <IndianRupee className="w-5 h-5 text-orange-700" />
                  <p className="text-2xl font-bold text-orange-700">
                    {calculateAmount()}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSubmit} className="flex-1 bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              {editingId ? 'Update Credit' : 'Add Credit'}
            </Button>
            {editingId && (
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Credit Sales List - Only show when NOT in dialog mode */}
      {!hideRecordsList ? (
      <Card className={`${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
      } shadow-lg`}>
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Credit Sales Records ({filteredCreditData.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="p-4 space-y-3">
              {filteredCreditData.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No credit sales for {selectedDate === new Date().toISOString().split('T')[0] ? 'today' : 'selected date'}</p>
                </div>
              ) : (
                filteredCreditData.map((credit) => (
                  <div key={credit.id} className={`border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow ${
                    isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-slate-200 bg-white'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="bg-purple-100 text-purple-800 border-0 text-xs">
                          {credit.fuelType}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => editCredit(credit)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteCredit(credit.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className={`font-semibold text-sm sm:text-base break-words ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{credit.customerName}</h4>
                      {credit.vehicleNumber && (
                        <p className={`text-xs sm:text-sm break-words ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Vehicle: {credit.vehicleNumber}</p>
                      )}
                    </div>

                    <div className="space-y-1.5 text-xs sm:text-sm mt-3">
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                        <div className="flex flex-col sm:flex-row sm:gap-1">
                          <span className={`font-medium ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Litres:</span>
                          <span className="font-medium">{credit.liters}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:gap-1">
                          <span className={`font-medium ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Rate:</span>
                          <span className="font-medium">₹{credit.rate}</span>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-3" />

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <span className={`font-semibold text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>Total Amount:</span>
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-4 h-4 text-orange-600" />
                        <span className="text-lg sm:text-xl font-bold text-orange-600">
                          {credit.amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      ) : null}
      </div>
    </div>
  );
};

export default CreditSales;