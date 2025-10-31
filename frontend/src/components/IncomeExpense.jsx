import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Edit,
  Trash2,
  IndianRupee,
  Receipt
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const IncomeExpense = ({ isDarkMode, incomeData, addIncomeRecord, updateIncomeRecord, deleteIncomeRecord, expenseData, addExpenseRecord, updateExpenseRecord, deleteExpenseRecord, selectedDate, salesData, creditData, formResetKey, editingRecord, onRecordSaved, hideRecordsList }) => {
  const [activeType, setActiveType] = useState('income');
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    type: 'income'
  });
  const [editingId, setEditingId] = useState(null);
  const { toast } = useToast();

  // Pre-fill form when editingRecord is provided
  useEffect(() => {
    if (editingRecord) {
      const recordType = editingRecord.type || 'income';
      setActiveType(recordType);
      setFormData({
        amount: editingRecord.amount?.toString() || '',
        description: editingRecord.description || '',
        type: recordType
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
        amount: '',
        description: '',
        type: 'income'
      });
      setActiveType('income');
    }
  }, [formResetKey, editingRecord, editingId]);

  // Removed category arrays - simplified to just amount and description

  const handleSubmit = () => {
    if (!formData.amount) {
      return;
    }

    const record = {
      id: editingId || Date.now(),
      date: selectedDate,
      ...formData,
      amount: parseFloat(formData.amount)
    };

    if (editingId) {
      // Update existing record
      const recordData = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        date: selectedDate
      };
      
      if (activeType === 'income' && updateIncomeRecord) {
        updateIncomeRecord(editingId, recordData);
      } else if (activeType === 'expense' && updateExpenseRecord) {
        updateExpenseRecord(editingId, recordData);
      }
      setEditingId(null);
      setFormData({ description: '', amount: '' });
      // Close dialog after updating
      if (onRecordSaved) onRecordSaved();
    } else {
      if (activeType === 'income') {
        const newIncome = addIncomeRecord({
          description: formData.description,
          amount: parseFloat(formData.amount),
          date: selectedDate
        });
        
        if (newIncome) {
          setFormData({ description: '', amount: '' });
          // Close dialog after adding
          if (onRecordSaved) onRecordSaved();
        }
      } else {
        const newExpense = addExpenseRecord({
          description: formData.description,
          amount: parseFloat(formData.amount),
          date: selectedDate
        });
        
        if (newExpense) {
          setFormData({ description: '', amount: '' });
          // Close dialog after adding
          if (onRecordSaved) onRecordSaved();
        }
      }
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      amount: '',
      description: '',
      type: activeType
    });
    setEditingId(null);
  };

  const editRecord = (record, type) => {
    if (editingId === record.id) {
      // Cancel editing
      setEditingId(null);
      setFormData({ description: '', amount: '' });
    } else {
      // Start editing
      setActiveType(type);
      setEditingId(record.id);
      setFormData({
        description: record.description,
        amount: record.amount.toString()
      });
    }
  };

  const deleteRecord = (id, type) => {
    if (type === 'income' && deleteIncomeRecord) {
      deleteIncomeRecord(id);
    } else if (type === 'expense' && deleteExpenseRecord) {
      deleteExpenseRecord(id);
    }
  };

  // Filter data for selected date  
  const filteredIncomeData = incomeData.filter(item => item.date === selectedDate);
  const filteredExpenseData = expenseData.filter(item => item.date === selectedDate);
  
  // Calculate cash position for the selected date
  const getFuelCashSales = () => {
    if (!salesData) return 0;
    const dailySales = salesData.filter(sale => sale.date === selectedDate);
    return dailySales.reduce((sum, sale) => sum + (sale.type === 'cash' ? sale.amount : 0), 0);
  };
  
  const currentData = activeType === 'income' ? filteredIncomeData : filteredExpenseData;
  
  // Calculate financial position
  const fuelCashSales = getFuelCashSales();
  const otherIncome = filteredIncomeData.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = filteredExpenseData.reduce((sum, item) => sum + item.amount, 0);
  
  // Total income from all sources
  const totalIncome = fuelCashSales + otherIncome;
  
  // Net cash in hand after all transactions
  const netCashInHand = fuelCashSales + otherIncome - totalExpenses;
  
  // Profit calculation (income - expenses)
  const netProfit = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      <div className={hideRecordsList ? "" : "grid grid-cols-1 lg:grid-cols-2 gap-6"}>
        {/* Input Form */}
        <Card className={`${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
        } shadow-lg`}>
          <CardHeader className={`${
            activeType === 'income' 
              ? 'bg-gradient-to-r from-green-600 to-green-700' 
              : 'bg-gradient-to-r from-red-600 to-red-700'
          } text-white rounded-t-lg`}>
            <CardTitle className="flex items-center gap-2">
              {activeType === 'income' ? (
                <TrendingUp className="w-5 h-5" />
              ) : (
                <TrendingDown className="w-5 h-5" />
              )}
              {editingId ? `Edit ${activeType}` : `Add ${activeType}`}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {/* Toggle Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <Button
                variant={activeType === 'income' ? 'default' : 'outline'}
                onClick={() => { setActiveType('income'); resetForm(); }}
                className={activeType === 'income' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Income
              </Button>
              <Button
                variant={activeType === 'expense' ? 'default' : 'outline'}
                onClick={() => { setActiveType('expense'); resetForm(); }}
                className={activeType === 'expense' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                <TrendingDown className="w-4 h-4 mr-2" />
                Expense
              </Button>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Amount (₹) *</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder={`Enter ${activeType} details...`}
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleSubmit} 
                className={`flex-1 ${
                  activeType === 'income' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                <Plus className="w-4 h-4 mr-2" />
                {editingId ? `Update ${activeType}` : `Add ${activeType}`}
              </Button>
              {editingId && (
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Records List - Only show when NOT in dialog mode */}
        {!hideRecordsList ? (
        <Card className={`${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
        } shadow-lg`}>
          <CardHeader className={`${
            activeType === 'income' 
              ? 'bg-gradient-to-r from-blue-600 to-blue-700' 
              : 'bg-gradient-to-r from-purple-600 to-purple-700'
          } text-white rounded-t-lg`}>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              {activeType === 'income' ? 'Income' : 'Expense'} Records ({currentData.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="p-4 space-y-3">
                {currentData.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    {activeType === 'income' ? (
                      <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    ) : (
                      <TrendingDown className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    )}
                    <p>No {activeType} records for {selectedDate === new Date().toISOString().split('T')[0] ? 'today' : 'selected date'}</p>
                  </div>
                ) : (
                  currentData.map((record) => (
                    <div key={record.id} className={`border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow ${
                      isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-slate-200 bg-white'
                    }`}>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <Badge className={`${
                          activeType === 'income' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        } border-0 text-xs w-fit`}>
                          {activeType === 'income' ? 'Income' : 'Expense'}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => editRecord(record, activeType)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => deleteRecord(record.id, activeType)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {record.description && (
                        <p className={`text-xs sm:text-sm mb-3 break-words ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>{record.description}</p>
                      )}

                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs sm:text-sm mb-2 gap-1">
                        <span className={`font-medium ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Date:</span>
                        <span className="font-medium">{record.date}</span>
                      </div>

                      <Separator className="my-3" />

                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                        <span className={`font-semibold text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>Amount:</span>
                        <div className="flex items-center gap-1">
                          <IndianRupee className={`w-4 h-4 ${
                            activeType === 'income' ? 'text-green-600' : 'text-red-600'
                          }`} />
                          <span className={`text-lg sm:text-xl font-bold ${
                            activeType === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {record.amount.toFixed(2)}
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

export default IncomeExpense;