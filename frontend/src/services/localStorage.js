/**
 * Local Storage Service for Offline M.Pump Calc
 * Handles all data persistence in browser localStorage
 */

class LocalStorageService {
  constructor() {
    this.keys = {
      salesData: 'mpump_sales_data',
      creditData: 'mpump_credit_data', 
      incomeData: 'mpump_income_data',
      expenseData: 'mpump_expense_data',
      fuelSettings: 'mpump_fuel_settings',
      rates: 'mpump_rates_by_date' // New: date-specific rates
    };
    
    this.initializeDefaultData();
  }

  // Initialize default data if not exists
  initializeDefaultData() {
    // Default fuel settings
    const defaultFuelSettings = {
      'Petrol': { price: 102.50, nozzleCount: 3 },
      'Diesel': { price: 89.75, nozzleCount: 2 },
      'CNG': { price: 75.20, nozzleCount: 2 },
      'Premium': { price: 108.90, nozzleCount: 1 }
    };

    const existingSettings = this.getFuelSettings();
    
    if (!existingSettings) {
      this.setFuelSettings(defaultFuelSettings);
    }

    // Initialize empty arrays if not exist
    if (!this.getSalesData()) this.setSalesData([]);
    if (!this.getCreditData()) this.setCreditData([]);
    if (!this.getIncomeData()) this.setIncomeData([]);
    if (!this.getExpenseData()) this.setExpenseData([]);
  }

  // Generic localStorage methods
  setItem(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      return false;
    }
  }

  getItem(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return null;
    }
  }

  // Sales Data Methods
  getSalesData() {
    return this.getItem(this.keys.salesData) || [];
  }

  setSalesData(data) {
    return this.setItem(this.keys.salesData, data);
  }

  addSaleRecord(saleData) {
    const sales = this.getSalesData();
    const newSale = {
      id: Date.now().toString(),
      date: saleData.date,
      nozzle: saleData.nozzle,
      fuelType: saleData.fuelType,
      startReading: parseFloat(saleData.startReading),
      endReading: parseFloat(saleData.endReading),
      liters: parseFloat(saleData.liters),
      rate: parseFloat(saleData.rate),
      amount: parseFloat(saleData.amount),
      type: 'cash',
      timestamp: new Date().toISOString()
    };
    
    sales.push(newSale);
    this.setSalesData(sales);
    return newSale;
  }

  // Credit Data Methods
  getCreditData() {
    return this.getItem(this.keys.creditData) || [];
  }

  setCreditData(data) {
    return this.setItem(this.keys.creditData, data);
  }

  addCreditRecord(creditData) {
    const credits = this.getCreditData();
    const newCredit = {
      id: Date.now().toString(),
      date: creditData.date,
      customerName: creditData.customerName,
      vehicleNumber: creditData.vehicleNumber || 'N/A',
      fuelType: creditData.fuelType || 'N/A',
      liters: parseFloat(creditData.liters || 0),
      rate: parseFloat(creditData.rate || 0),
      amount: parseFloat(creditData.amount),
      dueDate: creditData.dueDate || creditData.date,
      status: creditData.status || 'pending',
      timestamp: new Date().toISOString()
    };
    
    credits.push(newCredit);
    this.setCreditData(credits);
    return newCredit;
  }

  // Income Data Methods
  getIncomeData() {
    return this.getItem(this.keys.incomeData) || [];
  }

  setIncomeData(data) {
    return this.setItem(this.keys.incomeData, data);
  }

  addIncomeRecord(incomeData) {
    const income = this.getIncomeData();
    const newIncome = {
      id: Date.now().toString(),
      date: incomeData.date,
      amount: parseFloat(incomeData.amount),
      description: incomeData.description || incomeData.category || 'Income',
      type: 'income',
      timestamp: new Date().toISOString()
    };
    
    income.push(newIncome);
    this.setIncomeData(income);
    return newIncome;
  }

  // Expense Data Methods
  getExpenseData() {
    return this.getItem(this.keys.expenseData) || [];
  }

  setExpenseData(data) {
    return this.setItem(this.keys.expenseData, data);
  }

  addExpenseRecord(expenseData) {
    const expenses = this.getExpenseData();
    const newExpense = {
      id: Date.now().toString(),
      date: expenseData.date,
      amount: parseFloat(expenseData.amount),
      description: expenseData.description || expenseData.category || 'Expense',
      type: 'expense',
      timestamp: new Date().toISOString()
    };
    
    expenses.push(newExpense);
    this.setExpenseData(expenses);
    return newExpense;
  }

  // Fuel Settings Methods
  getFuelSettings() {
    return this.getItem(this.keys.fuelSettings);
  }

  setFuelSettings(settings) {
    return this.setItem(this.keys.fuelSettings, settings);
  }

  updateFuelRate(fuelType, rate, date = null) {
    // If date is provided, store rate for that specific date
    if (date) {
      return this.setRateForDate(fuelType, rate, date);
    }
    
    // Legacy: Update global settings (for backward compatibility)
    const settings = this.getFuelSettings() || {};
    if (settings[fuelType]) {
      settings[fuelType].price = parseFloat(rate);
      this.setFuelSettings(settings);
      return true;
    }
    return false;
  }

  // Date-specific rate methods
  getAllRates() {
    return this.getItem(this.keys.rates) || {};
  }

  setAllRates(rates) {
    return this.setItem(this.keys.rates, rates);
  }

  setRateForDate(fuelType, rate, date) {
    const rates = this.getAllRates();
    
    // Structure: { "2025-10-23": { "Petrol": 102.50, "Diesel": 89.75 }, ... }
    if (!rates[date]) {
      rates[date] = {};
    }
    
    rates[date][fuelType] = parseFloat(rate);
    return this.setAllRates(rates);
  }

  getRatesForDate(date) {
    const rates = this.getAllRates();
    
    // If rates exist for this exact date, return them
    if (rates[date]) {
      return rates[date];
    }
    
    // Otherwise, find the most recent previous date with rates
    const allDates = Object.keys(rates).sort().reverse();
    const previousDate = allDates.find(d => d < date);
    
    if (previousDate) {
      return rates[previousDate];
    }
    
    // No previous rates found, return empty
    return {};
  }

  // Get the last changed rate for a specific fuel type before the given date
  getLastChangedRate(fuelType, beforeDate) {
    const rates = this.getAllRates();
    
    // Get all dates with rates, sorted in descending order
    const allDates = Object.keys(rates)
      .filter(d => d < beforeDate)
      .sort()
      .reverse();
    
    // Find the most recent date that has a rate for this fuel type
    for (const date of allDates) {
      if (rates[date][fuelType] !== undefined) {
        return rates[date][fuelType];
      }
    }
    
    // No previous rate found
    return null;
  }

  // Data filtering methods
  getDataByDate(dataType, date) {
    let data = [];
    
    switch (dataType) {
      case 'sales':
        data = this.getSalesData();
        break;
      case 'credit':
        data = this.getCreditData();
        break;
      case 'income':
        data = this.getIncomeData();
        break;
      case 'expense':
        data = this.getExpenseData();
        break;
    }
    
    if (!date) return data;
    
    return data.filter(item => item.date === date);
  }

  // Delete methods
  deleteSaleRecord(id) {
    const sales = this.getSalesData();
    const updatedSales = sales.filter(sale => sale.id !== id);
    this.setSalesData(updatedSales);
    return true;
  }

  deleteCreditRecord(id) {
    const credits = this.getCreditData();
    const updatedCredits = credits.filter(credit => credit.id !== id);
    this.setCreditData(updatedCredits);
    return true;
  }

  deleteIncomeRecord(id) {
    const income = this.getIncomeData();
    const updatedIncome = income.filter(item => item.id !== id);
    this.setIncomeData(updatedIncome);
    return true;
  }

  deleteExpenseRecord(id) {
    const expenses = this.getExpenseData();
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    this.setExpenseData(updatedExpenses);
    return true;
  }

  // Update methods
  updateSaleRecord(id, updatedData) {
    const sales = this.getSalesData();
    const saleIndex = sales.findIndex(sale => sale.id === id);
    if (saleIndex !== -1) {
      sales[saleIndex] = { ...sales[saleIndex], ...updatedData };
      this.setSalesData(sales);
      return sales[saleIndex];
    }
    return null;
  }

  updateCreditRecord(id, updatedData) {
    const credits = this.getCreditData();
    const creditIndex = credits.findIndex(credit => credit.id === id);
    if (creditIndex !== -1) {
      credits[creditIndex] = { ...credits[creditIndex], ...updatedData };
      this.setCreditData(credits);
      return credits[creditIndex];
    }
    return null;
  }

  updateIncomeRecord(id, updatedData) {
    const income = this.getIncomeData();
    const incomeIndex = income.findIndex(item => item.id === id);
    if (incomeIndex !== -1) {
      income[incomeIndex] = { ...income[incomeIndex], ...updatedData };
      this.setIncomeData(income);
      return income[incomeIndex];
    }
    return null;
  }

  updateExpenseRecord(id, updatedData) {
    const expenses = this.getExpenseData();
    const expenseIndex = expenses.findIndex(expense => expense.id === id);
    if (expenseIndex !== -1) {
      expenses[expenseIndex] = { ...expenses[expenseIndex], ...updatedData };
      this.setExpenseData(expenses);
      return expenses[expenseIndex];
    }
    return null;
  }

  // Export all data (for backup)
  exportAllData() {
    return {
      salesData: this.getSalesData(),
      creditData: this.getCreditData(),
      incomeData: this.getIncomeData(),
      expenseData: this.getExpenseData(),
      fuelSettings: this.getFuelSettings(),
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
  }

  // Import all data (for restore)
  importAllData(data) {
    try {
      if (data.salesData) this.setSalesData(data.salesData);
      if (data.creditData) this.setCreditData(data.creditData);
      if (data.incomeData) this.setIncomeData(data.incomeData);
      if (data.expenseData) this.setExpenseData(data.expenseData);
      if (data.fuelSettings) this.setFuelSettings(data.fuelSettings);
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  // Clear all data
  clearAllData() {
    Object.values(this.keys).forEach(key => {
      localStorage.removeItem(key);
    });
    this.initializeDefaultData();
  }

  // Check storage usage
  getStorageInfo() {
    const totalSize = new Blob(Object.values(localStorage)).size;
    const itemCount = Object.keys(localStorage).filter(key => 
      key.startsWith('mpump_')
    ).length;
    
    return {
      totalSize,
      itemCount,
      maxSize: 5 * 1024 * 1024, // 5MB typical localStorage limit
      usagePercent: (totalSize / (5 * 1024 * 1024)) * 100
    };
  }
}

// Export singleton instance
export const localStorageService = new LocalStorageService();
export default localStorageService;