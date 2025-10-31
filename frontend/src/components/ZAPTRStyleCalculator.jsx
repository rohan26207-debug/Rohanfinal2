import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { 
  Calculator, 
  CreditCard, 
  TrendingDown, 
  Moon,
  Sun,
  Fuel,
  IndianRupee,
  TrendingUp,
  Settings,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  Share2,
  Receipt
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import useAutoBackup from '../hooks/use-auto-backup';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import SalesTracker from './SalesTracker';
import CreditSales from './CreditSales';
import IncomeExpense from './IncomeExpense';
import PriceConfiguration from './PriceConfiguration';
import HeaderSettings from './HeaderSettings';
import UnifiedRecords from './UnifiedRecords';
import localStorageService from '../services/localStorage';

const ZAPTRStyleCalculator = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('allrecords');
  const [salesData, setSalesData] = useState([]);
  const [creditData, setCreditData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [fuelSettings, setFuelSettings] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Dialog states for edit functionality
  const [salesDialogOpen, setSalesDialogOpen] = useState(false);
  const [creditDialogOpen, setCreditDialogOpen] = useState(false);
  const [incomeExpenseDialogOpen, setIncomeExpenseDialogOpen] = useState(false);
  const [editingSaleData, setEditingSaleData] = useState(null);
  const [editingCreditData, setEditingCreditData] = useState(null);
  const [editingIncomeExpenseData, setEditingIncomeExpenseData] = useState(null);
  
  // PDF Settings Dialog
  const [pdfSettingsOpen, setPdfSettingsOpen] = useState(false);
  const [pdfSettings, setPdfSettings] = useState({
    includeSales: true,
    includeCredit: true,
    includeIncome: true,
    includeExpense: true,
    includeSummary: true,
    pageSize: 'a4',
    orientation: 'portrait',
    dateRange: 'single', // 'single' or 'range'
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  
  const { toast } = useToast();

  // Auto-backup hook - automatically saves to folder when data changes
  useAutoBackup(salesData, creditData, incomeData, expenseData, fuelSettings);

  // Load data from localStorage
  // Loading state removed per user request

  const loadData = () => {
    try {
      // Load all data from localStorage
      const salesData = localStorageService.getSalesData();
      const creditData = localStorageService.getCreditData();
      const incomeData = localStorageService.getIncomeData();
      const expenseData = localStorageService.getExpenseData();
      const fuelSettings = localStorageService.getFuelSettings();

      // Set data in component state
      setSalesData(salesData);
      setCreditData(creditData);
      setIncomeData(incomeData);
      setExpenseData(expenseData);
      setFuelSettings(fuelSettings);

    } catch (err) {
      console.error('Failed to load data from localStorage:', err);
      
      // Initialize with empty data if localStorage fails
      setSalesData([]);
      setCreditData([]);
      setIncomeData([]);
      setExpenseData([]);
      
      // Initialize default fuel settings
      const defaultFuelSettings = {
        'Petrol': { price: 102.50, nozzleCount: 3 },
        'Diesel': { price: 89.75, nozzleCount: 2 },
        'CNG': { price: 75.20, nozzleCount: 2 },
        'Premium': { price: 108.90, nozzleCount: 1 }
      };
      setFuelSettings(defaultFuelSettings);
      localStorageService.setFuelSettings(defaultFuelSettings);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Reload data when date changes (to reflect any new data)
  useEffect(() => {
    loadData();
    
    // Reset all forms when date changes to prevent adding old data to new date
    resetAllForms();
  }, [selectedDate]);

  // Function to reset all child component forms
  const resetAllForms = () => {
    // Trigger reset in child components by updating a reset key
    setFormResetKey(prev => prev + 1);
  };

  // Add form reset state to force child component form resets
  const [formResetKey, setFormResetKey] = useState(0);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const goToPreviousDay = () => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() - 1);
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  const goToNextDay = () => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + 1);
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  const goToToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const formatDisplayDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getTodayStats = () => {
    const todaySales = salesData.filter(sale => sale.date === selectedDate);
    const todayCredits = creditData.filter(credit => credit.date === selectedDate);
    const todayIncome = incomeData.filter(income => income.date === selectedDate);
    const todayExpenses = expenseData.filter(expense => expense.date === selectedDate);

    // Calculate fuel sales by fuel type
    const fuelSalesByType = {};
    todaySales.forEach(sale => {
      if (!fuelSalesByType[sale.fuelType]) {
        fuelSalesByType[sale.fuelType] = { liters: 0, amount: 0 };
      }
      fuelSalesByType[sale.fuelType].liters += sale.liters;
      fuelSalesByType[sale.fuelType].amount += sale.amount;
    });
    
    // Base cash from fuel sales
    const fuelCashSales = todaySales.reduce((sum, sale) => sum + (sale.type === 'cash' ? sale.amount : 0), 0);
    
    // Other income adds to cash
    const otherIncome = todayIncome.reduce((sum, income) => sum + income.amount, 0);
    
    // Expenses reduce cash
    const totalExpenses = todayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Calculate credit amount and liters
    const creditAmount = todayCredits.reduce((sum, credit) => sum + credit.amount, 0);
    const creditLiters = todayCredits.reduce((sum, credit) => sum + credit.liters, 0);
    
    // Adjusted cash sales = fuel cash + other income - expenses - credit sales
    const adjustedCashSales = fuelCashSales + otherIncome - totalExpenses - creditAmount;
    const totalLiters = todaySales.reduce((sum, sale) => sum + sale.liters, 0);
    
    // Total income is fuel sales + other income
    const totalIncome = fuelCashSales + otherIncome;
    
    // Net cash position (what's actually in hand)
    const netCash = adjustedCashSales;
    
    return { 
      fuelCashSales,
      adjustedCashSales,
      creditAmount,
      creditLiters,
      totalLiters, 
      totalSales: fuelCashSales + creditAmount,
      otherIncome,
      totalIncome,
      totalExpenses,
      netCash,
      fuelSalesByType
    };
  };

  const stats = getTodayStats();

  // Data handling functions (offline localStorage)
  const addSaleRecord = (saleData) => {
    try {
      const newSale = localStorageService.addSaleRecord({
        ...saleData,
        date: selectedDate
      });
      
      // Update local state immediately
      setSalesData(prev => [...prev, newSale]);
      
      return newSale;
    } catch (error) {
      console.error('Failed to add sale record:', error);
    }
  };

  const addCreditRecord = (creditData) => {
    try {
      const newCredit = localStorageService.addCreditRecord({
        ...creditData,
        date: selectedDate
      });
      
      // Update local state immediately
      setCreditData(prev => [...prev, newCredit]);
      
      return newCredit;
    } catch (error) {
      console.error('Failed to add credit record:', error);
    }
  };

  const addIncomeRecord = (incomeData) => {
    try {
      const newIncome = localStorageService.addIncomeRecord({
        ...incomeData,
        date: selectedDate
      });
      
      // Update local state immediately
      setIncomeData(prev => [...prev, newIncome]);
      
      return newIncome;
    } catch (error) {
      console.error('Failed to add income record:', error);
    }
  };

  const addExpenseRecord = (expenseData) => {
    try {
      const newExpense = localStorageService.addExpenseRecord({
        ...expenseData,
        date: selectedDate
      });
      
      // Update local state immediately
      setExpenseData(prev => [...prev, newExpense]);
      
      return newExpense;
    } catch (error) {
      console.error('Failed to add expense record:', error);
    }
  };

  // Delete functions
  const deleteSaleRecord = (id) => {
    try {
      const success = localStorageService.deleteSaleRecord(id);
      if (success) {
        setSalesData(prev => prev.filter(sale => sale.id !== id));
        return true;
      }
    } catch (error) {
      console.error('Failed to delete sale record:', error);
    }
    return false;
  };

  const deleteCreditRecord = (id) => {
    try {
      const success = localStorageService.deleteCreditRecord(id);
      if (success) {
        setCreditData(prev => prev.filter(credit => credit.id !== id));
        return true;
      }
    } catch (error) {
      console.error('Failed to delete credit record:', error);
    }
    return false;
  };

  const deleteIncomeRecord = (id) => {
    try {
      const success = localStorageService.deleteIncomeRecord(id);
      if (success) {
        setIncomeData(prev => prev.filter(income => income.id !== id));
        return true;
      }
    } catch (error) {
      console.error('Failed to delete income record:', error);
    }
    return false;
  };

  const deleteExpenseRecord = (id) => {
    try {
      const success = localStorageService.deleteExpenseRecord(id);
      if (success) {
        setExpenseData(prev => prev.filter(expense => expense.id !== id));
        return true;
      }
    } catch (error) {
      console.error('Failed to delete expense record:', error);
    }
    return false;
  };

  // Edit dialog handlers
  const handleEditSale = (saleRecord) => {
    setEditingSaleData(saleRecord);
    setSalesDialogOpen(true);
  };

  const handleEditCredit = (creditRecord) => {
    setEditingCreditData(creditRecord);
    setCreditDialogOpen(true);
  };

  const handleEditIncomeExpense = (record, type) => {
    setEditingIncomeExpenseData({ ...record, type });
    setIncomeExpenseDialogOpen(true);
  };

  const handleCloseDialogs = () => {
    setSalesDialogOpen(false);
    setCreditDialogOpen(false);
    setIncomeExpenseDialogOpen(false);
    setEditingSaleData(null);
    setEditingCreditData(null);
    setEditingIncomeExpenseData(null);
  };

  // Update functions
  const updateSaleRecord = (id, updatedData) => {
    try {
      const updatedSale = localStorageService.updateSaleRecord(id, updatedData);
      if (updatedSale) {
        setSalesData(prev => prev.map(sale => sale.id === id ? updatedSale : sale));
        return updatedSale;
      }
    } catch (error) {
      console.error('Failed to update sale record:', error);
    }
    return null;
  };

  const updateCreditRecord = (id, updatedData) => {
    try {
      const updatedCredit = localStorageService.updateCreditRecord(id, updatedData);
      if (updatedCredit) {
        setCreditData(prev => prev.map(credit => credit.id === id ? updatedCredit : credit));
        return updatedCredit;
      }
    } catch (error) {
      console.error('Failed to update credit record:', error);
    }
    return null;
  };

  const updateIncomeRecord = (id, updatedData) => {
    try {
      const updatedIncome = localStorageService.updateIncomeRecord(id, updatedData);
      if (updatedIncome) {
        setIncomeData(prev => prev.map(income => income.id === id ? updatedIncome : income));
        return updatedIncome;
      }
    } catch (error) {
      console.error('Failed to update income record:', error);
    }
    return null;
  };

  const updateExpenseRecord = (id, updatedData) => {
    try {
      const updatedExpense = localStorageService.updateExpenseRecord(id, updatedData);
      if (updatedExpense) {
        setExpenseData(prev => prev.map(expense => expense.id === id ? updatedExpense : expense));
        return updatedExpense;
      }
    } catch (error) {
      console.error('Failed to update expense record:', error);
    }
    return null;
  };

  const updateFuelRate = (fuelType, rate, date = selectedDate) => {
    try {
      // Save rate for the specific date
      const success = localStorageService.updateFuelRate(fuelType, rate, date);
      
      if (success) {
        // Update local state immediately
        setFuelSettings(prev => ({
          ...prev,
          [fuelType]: { ...prev[fuelType], price: parseFloat(rate) }
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating fuel rate:', error);
      return false;
    }
  };

  // Export functions
  
  // Helper function to calculate stats for any data set
  const calculateStats = (sales, credits, income, expenses) => {
    const fuelSalesByType = {};
    let totalLiters = 0;
    let fuelCashSales = 0;

    sales.forEach(sale => {
      if (!fuelSalesByType[sale.fuelType]) {
        fuelSalesByType[sale.fuelType] = { liters: 0, amount: 0 };
      }
      fuelSalesByType[sale.fuelType].liters += sale.liters;
      fuelSalesByType[sale.fuelType].amount += sale.amount;
      totalLiters += sale.liters;
      fuelCashSales += sale.amount;
    });

    const creditLiters = credits.reduce((sum, credit) => sum + (credit.liters || 0), 0);
    const creditAmount = credits.reduce((sum, credit) => sum + credit.amount, 0);
    const otherIncome = income.reduce((sum, inc) => sum + inc.amount, 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const adjustedCashSales = fuelCashSales + otherIncome - totalExpenses;

    return {
      fuelSalesByType,
      totalLiters,
      fuelCashSales,
      creditLiters,
      creditAmount,
      otherIncome,
      totalExpenses,
      adjustedCashSales
    };
  };
  
  // Direct PDF generation (works in AppsGeyser/WebView)
  const generateDirectPDF = () => {
    try {
      // Filter data based on date settings
      let filteredSales, filteredCredits, filteredIncome, filteredExpenses;
      
      if (pdfSettings.dateRange === 'single') {
        filteredSales = salesData.filter(sale => sale.date === pdfSettings.startDate);
        filteredCredits = creditData.filter(credit => credit.date === pdfSettings.startDate);
        filteredIncome = incomeData.filter(income => income.date === pdfSettings.startDate);
        filteredExpenses = expenseData.filter(expense => expense.date === pdfSettings.startDate);
      } else {
        // Date range filter
        filteredSales = salesData.filter(sale => sale.date >= pdfSettings.startDate && sale.date <= pdfSettings.endDate);
        filteredCredits = creditData.filter(credit => credit.date >= pdfSettings.startDate && credit.date <= pdfSettings.endDate);
        filteredIncome = incomeData.filter(income => income.date >= pdfSettings.startDate && income.date <= pdfSettings.endDate);
        filteredExpenses = expenseData.filter(expense => expense.date >= pdfSettings.startDate && expense.date <= pdfSettings.endDate);
      }

      // Calculate stats for filtered data
      const filteredStats = calculateStats(filteredSales, filteredCredits, filteredIncome, filteredExpenses);

      // Create PDF with settings
      const doc = new jsPDF({
        orientation: pdfSettings.orientation,
        unit: 'mm',
        format: pdfSettings.pageSize
      });

      // Set font
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('M.Pump Calc Daily Report', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const dateText = pdfSettings.dateRange === 'single' 
        ? pdfSettings.startDate 
        : `${pdfSettings.startDate} to ${pdfSettings.endDate}`;
      doc.text(dateText, doc.internal.pageSize.getWidth() / 2, 22, { align: 'center' });

      let yPos = 30;

      // SUMMARY TABLE (if enabled)
      if (pdfSettings.includeSummary) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('SUMMARY', 14, yPos);
        yPos += 5;

        const summaryData = [];
        let rowNum = 1;
        
        // Fuel sales by type
        Object.entries(filteredStats.fuelSalesByType).forEach(([fuelType, data]) => {
        summaryData.push([
          `${rowNum}. ${fuelType} Sales`,
          data.liters.toFixed(2),
          `₹${data.amount.toFixed(2)}`
        ]);
        rowNum++;
      });

        // Total if multiple fuel types
        if (Object.keys(filteredStats.fuelSalesByType).length > 1) {
          summaryData.push([
            'Total Reading Sales',
            filteredStats.totalLiters.toFixed(2),
            `₹${filteredStats.fuelCashSales.toFixed(2)}`
          ]);
        }

        if (pdfSettings.includeCredit) {
          summaryData.push([
            `${rowNum}. Credit Sales`,
            filteredStats.creditLiters.toFixed(2),
            `₹${filteredStats.creditAmount.toFixed(2)}`
          ]);
          rowNum++;
        }

        if (pdfSettings.includeIncome) {
          summaryData.push([
            `${rowNum}. Income`,
            '-',
            `₹${filteredStats.otherIncome.toFixed(2)}`
          ]);
          rowNum++;
        }

        if (pdfSettings.includeExpense) {
          summaryData.push([
            `${rowNum}. Expenses`,
            '-',
            `₹${filteredStats.totalExpenses.toFixed(2)}`
          ]);
        }

        summaryData.push([
          'Cash in Hand',
          '-',
          `₹${filteredStats.adjustedCashSales.toFixed(2)}`
        ]);

      doc.autoTable({
        startY: yPos,
        head: [['Category', 'Litres', 'Amount']],
        body: summaryData,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
        columnStyles: {
          1: { halign: 'right' },
          2: { halign: 'right' }
        }
      });

        yPos = doc.lastAutoTable.finalY + 10;
      }

      // READING SALES (if enabled and has data)
      if (pdfSettings.includeSales && filteredSales.length > 0) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('READING SALES', 14, yPos);
        yPos += 5;

        const salesTableData = filteredSales.map(sale => [
          sale.nozzle,
          sale.fuelType,
          sale.startReading,
          sale.endReading,
          sale.liters.toFixed(2),
          `₹${sale.rate.toFixed(2)}`,
          `₹${sale.amount.toFixed(2)}`
        ]);

        salesTableData.push([
          { content: 'Total Reading Sales', colSpan: 4, styles: { fontStyle: 'bold' } },
          filteredStats.totalLiters.toFixed(2),
          '-',
          `₹${filteredStats.fuelCashSales.toFixed(2)}`
        ]);

        doc.autoTable({
          startY: yPos,
          head: [['Nozzle', 'Fuel Type', 'Start', 'End', 'Liters', 'Rate', 'Amount']],
          body: salesTableData,
          theme: 'grid',
          styles: { fontSize: 7, cellPadding: 1.5 },
          headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
          columnStyles: {
            0: { halign: 'center', cellWidth: 15 },
            2: { halign: 'right', cellWidth: 20 },
            3: { halign: 'right', cellWidth: 20 },
            4: { halign: 'right' },
            5: { halign: 'right' },
            6: { halign: 'right', fontStyle: 'bold' }
          }
        });

        yPos = doc.lastAutoTable.finalY + 10;
      }

      // CREDIT SALES (if enabled and has data)
      if (pdfSettings.includeCredit && filteredCredits.length > 0 && yPos < 250) {
        if (yPos > 220) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('CREDIT SALES', 14, yPos);
        yPos += 5;

        const creditTableData = filteredCredits.map(credit => [
          credit.customerName,
          credit.vehicleNumber || 'N/A',
          credit.fuelType || 'N/A',
          credit.liters ? credit.liters.toFixed(2) : 'N/A',
          credit.rate ? `₹${credit.rate.toFixed(2)}` : 'N/A',
          `₹${credit.amount.toFixed(2)}`
        ]);

        creditTableData.push([
          { content: 'Total Credit Sales', colSpan: 5, styles: { fontStyle: 'bold' } },
          `₹${filteredStats.creditAmount.toFixed(2)}`
        ]);

        doc.autoTable({
          startY: yPos,
          head: [['Customer', 'Vehicle', 'Fuel Type', 'Liters', 'Rate', 'Amount']],
          body: creditTableData,
          theme: 'grid',
          styles: { fontSize: 7, cellPadding: 1.5 },
          headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
          columnStyles: {
            1: { halign: 'center' },
            3: { halign: 'right' },
            4: { halign: 'right' },
            5: { halign: 'right', fontStyle: 'bold' }
          }
        });

        yPos = doc.lastAutoTable.finalY + 10;
      }

      // INCOME & EXPENSES (if enabled and has data)
      const showIncome = pdfSettings.includeIncome && filteredIncome.length > 0;
      const showExpense = pdfSettings.includeExpense && filteredExpenses.length > 0;
      
      if ((showIncome || showExpense) && yPos < 250) {
        if (yPos > 220) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('INCOME & EXPENSES', 14, yPos);
        yPos += 5;

        const incomeExpenseData = [];
        if (showIncome) {
          filteredIncome.forEach(income => {
            incomeExpenseData.push(['Income', income.description, `₹${income.amount.toFixed(2)}`]);
          });
        }
        if (showExpense) {
          filteredExpenses.forEach(expense => {
            incomeExpenseData.push(['Expense', expense.description, `₹${expense.amount.toFixed(2)}`]);
          });
        }

        doc.autoTable({
          startY: yPos,
          head: [['Type', 'Description', 'Amount']],
          body: incomeExpenseData,
          theme: 'grid',
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
          columnStyles: {
            2: { halign: 'right' }
          }
        });
      }

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(
          `Generated on: ${new Date().toLocaleString()}`,
          105,
          287,
          { align: 'center' }
        );
      }

      // Generate filename
      const fileName = pdfSettings.dateRange === 'single' 
        ? `mpump-report-${pdfSettings.startDate}.pdf`
        : `mpump-report-${pdfSettings.startDate}-to-${pdfSettings.endDate}.pdf`;

      // Check if running in Android WebView
      const isAndroid = /Android/i.test(navigator.userAgent);
      const isWebView = /wv/.test(navigator.userAgent) || window.MPumpCalcAndroid;

      if (isAndroid && isWebView && window.MPumpCalcAndroid) {
        // Android WebView - Save to Downloads and open with viewer
        try {
          const pdfBlob = doc.output('blob');
          const reader = new FileReader();
          
          reader.onloadend = function() {
            const base64data = reader.result.split(',')[1];
            // Save PDF to Downloads/MPumpCalc folder and open with viewer
            window.MPumpCalcAndroid.openPdfWithViewer(base64data, fileName);
          };
          
          reader.readAsDataURL(pdfBlob);
          
          toast({
            title: "PDF Generated",
            description: "Saving PDF to Downloads folder...",
          });
        } catch (error) {
          console.error('Android PDF error:', error);
          // Fallback to download
          doc.save(fileName);
        }
      } else {
        // Browser - Normal download
        doc.save(fileName);
        
        toast({
          title: "PDF Generated",
          description: `${fileName} has been downloaded`,
        });
      }

    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "PDF Generation Failed",
        description: "Could not create PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const exportToPDF = () => {
    try {
      // Check if running in Android WebView
      const isAndroid = typeof window.MPumpCalcAndroid !== 'undefined';
      
      if (isAndroid) {
        // Generate PDF using jsPDF and pass to Android
        generatePDFForAndroid();
        return;
      }
      
      // Get today's data for web version
      const todaySales = salesData.filter(sale => sale.date === selectedDate);
      const todayCredits = creditData.filter(credit => credit.date === selectedDate);
      const todayIncome = incomeData.filter(income => income.date === selectedDate);
      const todayExpenses = expenseData.filter(expense => expense.date === selectedDate);

      // Create formatted HTML content with simplified markup
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<title>Daily Report - ${selectedDate}</title>
<style>
body{font:Arial;margin:10px;line-height:1.2}
h1{font-size:28px;margin:0;text-align:center}
p{font-size:18px;margin:2px 0;text-align:center}
.s{margin:15px 0 5px 0;font-size:18px;font-weight:bold}
table{width:100%;border-collapse:collapse;font-size:14px;margin:5px 0}
th{background:#f0f0f0;border:1px solid #000;padding:4px;text-align:center;font-weight:bold;font-size:15px}
td{border:1px solid #000;padding:3px;font-size:14px}
.r{text-align:right}
.c{text-align:center}
.t{font-weight:bold;background:#f8f8f8}
.print-btn{background:#007bff;color:white;border:none;padding:10px 20px;font-size:16px;cursor:pointer;border-radius:5px;margin:10px auto;display:block;box-shadow:0 2px 4px rgba(0,0,0,0.2)}
.print-btn:hover{background:#0056b3}
.no-print{display:block}
@media print{body{margin:8mm}.no-print{display:none}}
</style>
</head>
<body>
<h1>Daily Report</h1>
<p>Date: ${selectedDate}</p>

<div class="s">SUMMARY</div>
<table>
<tr><th>Category<th>Litres<th>Amount</tr>
${Object.entries(stats.fuelSalesByType).map(([fuelType, data]) => 
  `<tr><td>${fuelType} Sales<td class="r">${data.liters.toFixed(2)}L<td class="r">${data.amount.toFixed(2)}</tr>`
).join('')}
<tr><td>Credit Sales<td class="r">${stats.creditLiters.toFixed(2)}L<td class="r">${stats.creditAmount.toFixed(2)}</tr>
<tr><td>Income<td class="r">-<td class="r">${stats.otherIncome.toFixed(2)}</tr>
<tr><td>Expenses<td class="r">-<td class="r">${stats.totalExpenses.toFixed(2)}</tr>
<tr class="t"><td><b>Cash in Hand</b><td class="r"><b>${stats.totalLiters.toFixed(2)}L</b><td class="r"><b>${stats.adjustedCashSales.toFixed(2)}</b></tr>
</table>

${todaySales.length > 0 ? `
<div class="s">SALES RECORDS</div>
<table>
<tr><th width="8%">Sr.No<th width="22%">Description<th width="12%">Start<th width="12%">End<th width="12%">Rate<th width="12%">Litres<th width="12%">Amount</tr>
${todaySales.map((sale, index) => 
  `<tr><td class="c">${index + 1}<td>${sale.nozzle} - ${sale.fuelType}<td class="r">${sale.startReading}<td class="r">${sale.endReading}<td class="r">${sale.rate}<td class="r">${sale.liters}<td class="r">${sale.amount.toFixed(2)}</tr>`
).join('')}
<tr class="t"><td colspan="5" class="r"><b>Total:</b><td class="r"><b>${todaySales.reduce((sum, sale) => sum + parseFloat(sale.liters), 0).toFixed(2)}</b><td class="r"><b>${todaySales.reduce((sum, sale) => sum + parseFloat(sale.amount), 0).toFixed(2)}</b></tr>
</table>` : ''}

${todayCredits.length > 0 ? `
<div class="s">CREDIT RECORDS</div>
<table>
<tr><th width="8%">Sr.No<th width="35%">Customer<th width="20%">Vehicle<th width="12%">Rate<th width="12%">Litres<th width="13%">Amount</tr>
${todayCredits.map((credit, index) => 
  `<tr><td class="c">${index + 1}<td>${credit.customerName}<td>${credit.vehicleNumber || 'N/A'}<td class="r">${credit.rate}<td class="r">${credit.liters}<td class="r">${credit.amount.toFixed(2)}</tr>`
).join('')}
<tr class="t"><td colspan="4" class="r"><b>Total:</b><td class="r"><b>${todayCredits.reduce((sum, credit) => sum + parseFloat(credit.liters), 0).toFixed(2)}</b><td class="r"><b>${todayCredits.reduce((sum, credit) => sum + parseFloat(credit.amount), 0).toFixed(2)}</b></tr>
</table>` : ''}

${todayIncome.length > 0 ? `
<div class="s">INCOME RECORDS</div>
<table>
<tr><th width="10%">Sr.No<th width="70%">Description<th width="20%">Amount</tr>
${todayIncome.map((income, index) => 
  `<tr><td class="c">${index + 1}<td>${income.description}<td class="r">${income.amount.toFixed(2)}</tr>`
).join('')}
<tr class="t"><td colspan="2" class="r"><b>Total Income:</b><td class="r"><b>${todayIncome.reduce((sum, income) => sum + parseFloat(income.amount), 0).toFixed(2)}</b></tr>
</table>` : ''}

${todayExpenses.length > 0 ? `
<div class="s">EXPENSE RECORDS</div>
<table>
<tr><th width="10%">Sr.No<th width="70%">Description<th width="20%">Amount</tr>
${todayExpenses.map((expense, index) => 
  `<tr><td class="c">${index + 1}<td>${expense.description}<td class="r">${expense.amount.toFixed(2)}</tr>`
).join('')}
<tr class="t"><td colspan="2" class="r"><b>Total Expenses:</b><td class="r"><b>${todayExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0).toFixed(2)}</b></tr>
</table>` : ''}

<div style="margin-top:15px;text-align:center;font-size:10px;border-top:1px solid #000;padding-top:5px">
Generated on: ${new Date().toLocaleString()}
</div>

<div class="no-print" style="text-align:center;margin:20px 0">
<button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
</div>

<script>
// Auto print on load (with delay for content loading)
window.onload = function() {
  setTimeout(() => {
    window.print();
  }, 500);
};
</script>
</body>
</html>`;

      // Open in new window for printing/PDF generation
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (!printWindow) {
        alert('Please allow pop-ups for this site to enable PDF export and printing.');
        return;
      }
      
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Focus window
      printWindow.focus();

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  // Generate PDF for Android WebView using jsPDF
  const generatePDFForAndroid = () => {
    try {
      const todaySales = salesData.filter(sale => sale.date === selectedDate);
      const todayCredits = creditData.filter(credit => credit.date === selectedDate);
      const todayIncome = incomeData.filter(income => income.date === selectedDate);
      const todayExpenses = expenseData.filter(expense => expense.date === selectedDate);

      // Create PDF using jsPDF
      const doc = new jsPDF();
      let yPos = 20;

      // Title
      doc.setFontSize(18);
      doc.text('M.Pump Calc Daily Report', 105, yPos, { align: 'center' });
      yPos += 10;

      // Date
      doc.setFontSize(12);
      doc.text(`Date: ${selectedDate}`, 105, yPos, { align: 'center' });
      yPos += 15;

      // Summary Section
      doc.setFontSize(14);
      doc.text('SUMMARY', 14, yPos);
      yPos += 5;

      const summaryData = [];
      Object.entries(stats.fuelSalesByType).forEach(([fuelType, data]) => {
        summaryData.push([`${fuelType} Sales`, `${data.liters.toFixed(2)}L`, `${data.amount.toFixed(2)}`]);
      });
      summaryData.push(['Credit Sales', `${stats.creditLiters.toFixed(2)}L`, `${stats.creditAmount.toFixed(2)}`]);
      summaryData.push(['Income', '-', `${stats.otherIncome.toFixed(2)}`]);
      summaryData.push(['Expenses', '-', `${stats.totalExpenses.toFixed(2)}`]);
      summaryData.push(['Cash in Hand', `${stats.totalLiters.toFixed(2)}L`, `${stats.adjustedCashSales.toFixed(2)}`]);

      doc.autoTable({
        startY: yPos,
        head: [['Category', 'Litres', 'Amount']],
        body: summaryData,
        theme: 'grid',
        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
        styles: { fontSize: 10 }
      });

      yPos = doc.lastAutoTable.finalY + 10;

      // Sales Records
      if (todaySales.length > 0 && yPos < 250) {
        doc.setFontSize(14);
        doc.text('SALES RECORDS', 14, yPos);
        yPos += 5;

        const salesTableData = todaySales.map((sale, index) => [
          index + 1,
          `${sale.nozzle} - ${sale.fuelType}`,
          sale.startReading,
          sale.endReading,
          sale.rate,
          sale.liters,
          sale.amount.toFixed(2)
        ]);

        doc.autoTable({
          startY: yPos,
          head: [['#', 'Description', 'Start', 'End', 'Rate', 'Litres', 'Amount']],
          body: salesTableData,
          theme: 'grid',
          headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
          styles: { fontSize: 9 }
        });

        yPos = doc.lastAutoTable.finalY + 10;
      }

      // Add new page if needed
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      // Credit Records
      if (todayCredits.length > 0 && yPos < 250) {
        doc.setFontSize(14);
        doc.text('CREDIT RECORDS', 14, yPos);
        yPos += 5;

        const creditTableData = todayCredits.map((credit, index) => [
          index + 1,
          credit.customerName,
          credit.vehicleNumber || 'N/A',
          credit.rate,
          credit.liters,
          credit.amount.toFixed(2)
        ]);

        doc.autoTable({
          startY: yPos,
          head: [['#', 'Customer', 'Vehicle', 'Rate', 'Litres', 'Amount']],
          body: creditTableData,
          theme: 'grid',
          headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
          styles: { fontSize: 9 }
        });

        yPos = doc.lastAutoTable.finalY + 10;
      }

      // Add new page if needed
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      // Income Records
      if (todayIncome.length > 0 && yPos < 250) {
        doc.setFontSize(14);
        doc.text('INCOME RECORDS', 14, yPos);
        yPos += 5;

        const incomeTableData = todayIncome.map((income, index) => [
          index + 1,
          income.description,
          income.amount.toFixed(2)
        ]);

        doc.autoTable({
          startY: yPos,
          head: [['#', 'Description', 'Amount']],
          body: incomeTableData,
          theme: 'grid',
          headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
          styles: { fontSize: 9 }
        });

        yPos = doc.lastAutoTable.finalY + 10;
      }

      // Add new page if needed
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      // Expense Records
      if (todayExpenses.length > 0 && yPos < 250) {
        doc.setFontSize(14);
        doc.text('EXPENSE RECORDS', 14, yPos);
        yPos += 5;

        const expenseTableData = todayExpenses.map((expense, index) => [
          index + 1,
          expense.description,
          expense.amount.toFixed(2)
        ]);

        doc.autoTable({
          startY: yPos,
          head: [['#', 'Description', 'Amount']],
          body: expenseTableData,
          theme: 'grid',
          headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
          styles: { fontSize: 9 }
        });

        yPos = doc.lastAutoTable.finalY + 10;
      }

      // Get PDF as Base64
      const pdfBase64 = doc.output('dataurlstring').split(',')[1];
      const fileName = `Report_${selectedDate}.pdf`;

      // Call Android native method to save PDF
      if (window.MPumpCalcAndroid && window.MPumpCalcAndroid.openPdfWithViewer) {
        window.MPumpCalcAndroid.openPdfWithViewer(pdfBase64, fileName);
      }
    } catch (error) {
      console.error('Error generating PDF for Android:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  // Debug function removed

  // CSV export function removed per user request

  const copyToClipboard = () => {
    const textContent = generateTextContent();
    navigator.clipboard.writeText(textContent).then(() => {
      alert('Daily report copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = textContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Daily report copied to clipboard!');
    });
  };

  // PDF export content generation function removed

  // CSV content generation function removed per user request

  const generateTextContent = () => {
    const todaySales = salesData.filter(sale => sale.date === selectedDate);
    const todayCredits = creditData.filter(credit => credit.date === selectedDate);
    const todayIncome = incomeData.filter(income => income.date === selectedDate);
    const todayExpenses = expenseData.filter(expense => expense.date === selectedDate);

    let text = `Date: ${selectedDate}\n\n`;
    
    // Summary section
    text += `*Summary*\n`;
    Object.entries(stats.fuelSalesByType).forEach(([fuelType, data]) => {
      text += `${fuelType} Sales: ${data.liters.toFixed(2)}L - ${data.amount.toFixed(2)}\n`;
    });
    text += `Credit Sales: ${stats.creditLiters.toFixed(2)}L - ${stats.creditAmount.toFixed(2)}\n`;
    text += `Income: ${stats.otherIncome.toFixed(2)}\n`;
    text += `Expenses: ${stats.totalExpenses.toFixed(2)}\n`;
    text += `Cash in Hand: ${stats.adjustedCashSales.toFixed(2)}\n`;
    text += `-------\n\n`;
    
    // *Readings* section
    if (todaySales.length > 0) {
      text += `*Readings*\n`;
      todaySales.forEach((sale, index) => {
        text += `${index + 1}. Readings:\n`;
        text += ` Description: ${sale.nozzle}\n`;
        text += ` Starting: ${sale.startReading}\n`;
        text += ` Ending: ${sale.endReading}\n`;
        text += ` Litres: ${sale.liters}\n`;
        text += ` Rate: ${sale.rate}\n`;
        text += ` Amount: ${sale.amount.toFixed(2)}\n`;
      });
      text += `*Readings Total: ${stats.fuelCashSales.toFixed(2)}*\n`;
      text += `-------\n`;
    }
    
    // *Credits* section
    if (todayCredits.length > 0) {
      text += `*Credits*\n`;
      todayCredits.forEach((credit, index) => {
        text += `${index + 1}. Credit:\n`;
        text += ` Description: ${credit.customerName}\n`;
        text += ` Litre: ${credit.liters}\n`;
        text += ` Rate: ${credit.rate}\n`;
        text += ` Amount: ${credit.amount.toFixed(2)}\n`;
      });
      text += `*Credits Total: ${stats.creditAmount.toFixed(2)}*\n`;
      text += `-------\n`;
    }
    
    // *Income* section
    if (todayIncome.length > 0) {
      text += `*Income*\n`;
      todayIncome.forEach((income, index) => {
        text += `${index + 1}. Income:\n`;
        text += ` ${income.description}: ${income.amount.toFixed(2)}\n`;
      });
      text += `*Income Total: ${stats.otherIncome.toFixed(2)}*\n`;
      text += `-------\n`;
    }
    
    // *Expenses* section
    if (todayExpenses.length > 0) {
      text += `*Expenses*\n`;
      todayExpenses.forEach((expense, index) => {
        text += `${index + 1}. Expenses:\n`;
        text += ` ${expense.description}: ${expense.amount.toFixed(2)}\n`;
      });
      text += `*Expenses Total: ${stats.totalExpenses.toFixed(2)}*\n`;
      text += `-------\n`;
    }
    
    text += `\n************************\n`;
    text += `*Total Amount: ${stats.adjustedCashSales.toFixed(2)}*\n`;
    
    return text;
  };

  // Loading screen removed per user request

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-slate-50 to-slate-100'
    }`}>
      <div className="max-w-7xl mx-auto p-2 sm:p-4">
        
        {/* Offline mode display removed per user request */}
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-8 pt-status-bar">
          {/* Left Side: Settings and App Title */}
          <div className="flex items-center gap-2 sm:gap-4">
            <HeaderSettings 
              isDarkMode={isDarkMode}
              fuelSettings={fuelSettings}
              setFuelSettings={setFuelSettings}
            />
            
            <div 
              className="flex items-center gap-2 sm:gap-3"
            >
              <div className="p-1.5 sm:p-2 bg-blue-600 rounded-full">
                <Fuel className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className={`text-base sm:text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>
                M.Pump Calc
              </h1>
            </div>
          </div>
          
          {/* Right Side: Dark Mode Toggle */}
          <Button
            variant="outline"
            onClick={toggleTheme}
            className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-4"
          >
            {isDarkMode ? <Sun className="w-3 h-3 sm:w-4 sm:h-4" /> : <Moon className="w-3 h-3 sm:w-4 sm:h-4" />}
            <span className="hidden sm:inline">{isDarkMode ? 'Light' : 'Dark'}</span>
            <span className="sm:hidden">{isDarkMode ? 'L' : 'D'}</span>
          </Button>
        </div>

        {/* Export Section */}
        <Card className={`${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
        } shadow-lg mb-2`}>
          <CardContent className="p-2 sm:p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <FileText className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <div className="min-w-0">
                  <Label className={`text-xs sm:text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-slate-600'
                  }`}>
                    Export Daily Report
                  </Label>
                  <div className={`text-xs sm:text-sm truncate ${
                    isDarkMode ? 'text-gray-400' : 'text-slate-500'
                  }`}>
                    {selectedDate}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToPDF}
                  className={`text-xs h-7 px-2 ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="w-3 h-3 mr-1" />
                  PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className={`text-xs h-7 px-2 ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Share2 className="w-3 h-3 mr-1" />
                  Copy
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Data Backup Section removed */}


        {/* Date Section */}
        <Card className={`${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
        } shadow-lg mb-2`}>
          <CardContent className="p-2 sm:p-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Calendar className={`w-5 h-5 sm:w-6 sm:h-6 ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <div className="flex-1 min-w-0">
                  <Label className={`text-xs sm:text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-slate-600'
                  }`}>
                    Operating Date
                  </Label>
                  <div className={`text-sm sm:text-xl font-bold truncate ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    {formatDisplayDate(selectedDate)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1 sm:gap-2 w-full">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousDay}
                  className={`h-8 w-8 sm:h-10 sm:w-10 p-0 flex-shrink-0 ${
                    isDarkMode ? 'border-gray-600 hover:bg-gray-700' : ''
                  }`}
                >
                  <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                
                <div className={`border rounded-lg p-1 sm:p-1.5 flex-1 min-w-0 ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700' 
                    : 'border-slate-300 bg-white'
                }`}>
                  <Input
                    id="date-picker"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className={`h-6 sm:h-8 w-full border-0 bg-transparent focus:ring-0 text-xs sm:text-sm ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}
                  />
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextDay}
                  className={`h-8 w-8 sm:h-10 sm:w-10 p-0 flex-shrink-0 ${
                    isDarkMode ? 'border-gray-600 hover:bg-gray-700' : ''
                  }`}
                >
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Section */}
        <Card className={`${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
        } shadow-lg mb-2`}>
          <CardContent className="p-2 sm:p-3">
            <h2 className={`text-lg sm:text-2xl font-bold mb-2 ${
              isDarkMode ? 'text-white' : 'text-slate-800'
            }`}>
              Summary
            </h2>
            
            <div className="space-y-1.5 sm:space-y-2">
              {/* Reading Sales by Fuel Type */}
              {Object.entries(stats.fuelSalesByType).map(([fuelType, data], index) => (
                <div key={fuelType} className={`flex items-center justify-between py-1.5 px-2 sm:py-2 sm:px-3 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-blue-50'
                }`}>
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className={`font-medium text-xs sm:text-base truncate ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>
                      {fuelType} Sales
                    </span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-xs sm:text-lg font-bold whitespace-nowrap ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>
                      {data.liters.toFixed(2)}L • ₹{data.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Show total if there are multiple fuel types */}
              {Object.keys(stats.fuelSalesByType).length > 1 && (
                <div className={`flex items-center justify-between py-1.5 px-2 sm:py-2 sm:px-3 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-slate-50'
                } border-2 border-dashed ${isDarkMode ? 'border-gray-600' : 'border-slate-300'}`}>
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-slate-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                      T
                    </div>
                    <span className={`font-medium text-xs sm:text-base truncate ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>
                      Total Reading Sales
                    </span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-xs sm:text-lg font-bold whitespace-nowrap ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>
                      {stats.totalLiters.toFixed(2)}L • ₹{stats.fuelCashSales.toFixed(2)}
                    </div>
                  </div>
                </div>
              )}

              {/* Credit Sales */}
              <div className={`flex items-center justify-between py-1.5 px-2 sm:py-2 sm:px-3 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-orange-50'
              }`}>
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                    {Object.keys(stats.fuelSalesByType).length + (Object.keys(stats.fuelSalesByType).length > 1 ? 2 : 1)}
                  </div>
                  <span className={`font-medium text-xs sm:text-base truncate ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    Credit Sales
                  </span>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`text-xs sm:text-lg font-bold whitespace-nowrap ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    {stats.creditLiters.toFixed(2)}L • {stats.creditAmount.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Income */}
              <div className={`flex items-center justify-between py-1.5 px-2 sm:py-2 sm:px-3 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-green-50'
              }`}>
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                    {Object.keys(stats.fuelSalesByType).length + (Object.keys(stats.fuelSalesByType).length > 1 ? 3 : 2)}
                  </div>
                  <span className={`font-medium text-xs sm:text-base truncate ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    Income
                  </span>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`text-xs sm:text-lg font-bold whitespace-nowrap ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    {stats.otherIncome.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Expenses */}
              <div className={`flex items-center justify-between py-1.5 px-2 sm:py-2 sm:px-3 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-red-50'
              }`}>
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                    {Object.keys(stats.fuelSalesByType).length + (Object.keys(stats.fuelSalesByType).length > 1 ? 4 : 3)}
                  </div>
                  <span className={`font-medium text-xs sm:text-base truncate ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    Expenses
                  </span>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`text-xs sm:text-lg font-bold whitespace-nowrap ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    {stats.totalExpenses.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Cash in Hand */}
              <div className={`flex items-center justify-between py-1.5 px-2 sm:py-2 sm:px-3 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-purple-50'
              }`}>
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                    {Object.keys(stats.fuelSalesByType).length + (Object.keys(stats.fuelSalesByType).length > 1 ? 5 : 4)}
                  </div>
                  <span className={`font-medium text-xs sm:text-base truncate ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    Cash in Hand
                  </span>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`text-xs sm:text-lg font-bold whitespace-nowrap ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    {stats.adjustedCashSales.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards section removed as requested by user */}

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-2">
          <Button 
            className={`flex items-center justify-center gap-2 h-12 ${
              isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
            onClick={() => {
              setEditingSaleData(null);
              setSalesDialogOpen(true);
            }}
          >
            <Calculator className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Reading Sales</span>
          </Button>
          
          <Sheet open={salesDialogOpen} onOpenChange={setSalesDialogOpen}>
            <SheetContent side="bottom" className={`h-[90vh] ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
              <SheetHeader>
                <SheetTitle className={isDarkMode ? 'text-white' : 'text-slate-800'}>
                  {editingSaleData ? 'Edit Sale Record' : 'Add Sale Record'}
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 overflow-y-auto h-[calc(90vh-80px)]">
                <SalesTracker 
                  isDarkMode={isDarkMode}
                  salesData={salesData}
                  addSaleRecord={addSaleRecord}
                  updateSaleRecord={updateSaleRecord}
                  deleteSaleRecord={deleteSaleRecord}
                  fuelSettings={fuelSettings}
                  selectedDate={selectedDate}
                  creditData={creditData}
                  incomeData={incomeData}
                  expenseData={expenseData}
                  formResetKey={formResetKey}
                  editingRecord={editingSaleData}
                  onRecordSaved={handleCloseDialogs}
                  hideRecordsList={true}
                />
              </div>
            </SheetContent>
          </Sheet>

          <Button 
            className={`flex items-center justify-center gap-2 h-12 ${
              isDarkMode ? 'bg-orange-600 hover:bg-orange-700' : 'bg-orange-600 hover:bg-orange-700'
            } text-white`}
            onClick={() => {
              setEditingCreditData(null);
              setCreditDialogOpen(true);
            }}
          >
            <CreditCard className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Credit Sales</span>
          </Button>
          
          <Sheet open={creditDialogOpen} onOpenChange={setCreditDialogOpen}>
            <SheetContent side="bottom" className={`h-[90vh] ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
              <SheetHeader>
                <SheetTitle className={isDarkMode ? 'text-white' : 'text-slate-800'}>
                  {editingCreditData ? 'Edit Credit Record' : 'Add Credit Record'}
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 overflow-y-auto h-[calc(90vh-80px)]">
                <CreditSales 
                  isDarkMode={isDarkMode}
                  creditData={creditData}
                  addCreditRecord={addCreditRecord}
                  updateCreditRecord={updateCreditRecord}
                  deleteCreditRecord={deleteCreditRecord}
                  fuelSettings={fuelSettings}
                  selectedDate={selectedDate}
                  salesData={salesData}
                  incomeData={incomeData}
                  expenseData={expenseData}
                  formResetKey={formResetKey}
                  editingRecord={editingCreditData}
                  onRecordSaved={handleCloseDialogs}
                  hideRecordsList={true}
                />
              </div>
            </SheetContent>
          </Sheet>

          <Button 
            className={`flex items-center justify-center gap-2 h-12 ${
              isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-600 hover:bg-green-700'
            } text-white`}
            onClick={() => {
              setEditingIncomeExpenseData(null);
              setIncomeExpenseDialogOpen(true);
            }}
          >
            <TrendingDown className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Inc./Exp.</span>
          </Button>
          
          <Sheet open={incomeExpenseDialogOpen} onOpenChange={setIncomeExpenseDialogOpen}>
            <SheetContent side="bottom" className={`h-[90vh] ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
              <SheetHeader>
                <SheetTitle className={isDarkMode ? 'text-white' : 'text-slate-800'}>
                  {editingIncomeExpenseData ? 'Edit Income/Expense' : 'Add Income/Expense'}
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 overflow-y-auto h-[calc(90vh-80px)]">
                <IncomeExpense 
                  isDarkMode={isDarkMode}
                  incomeData={incomeData}
                  addIncomeRecord={addIncomeRecord}
                  updateIncomeRecord={updateIncomeRecord}
                  deleteIncomeRecord={deleteIncomeRecord}
                  expenseData={expenseData}
                  addExpenseRecord={addExpenseRecord}
                  updateExpenseRecord={updateExpenseRecord}
                  deleteExpenseRecord={deleteExpenseRecord}
                  selectedDate={selectedDate}
                  salesData={salesData}
                  creditData={creditData}
                  formResetKey={formResetKey}
                  editingRecord={editingIncomeExpenseData}
                  onRecordSaved={handleCloseDialogs}
                  hideRecordsList={true}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full grid-cols-2 mb-2 ${
            isDarkMode ? 'bg-gray-800' : 'bg-slate-100'
          }`}>
            <TabsTrigger value="allrecords" className="flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              All Records
            </TabsTrigger>
            <TabsTrigger value="prices" className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4" />
              Rate
            </TabsTrigger>
          </TabsList>

          <TabsContent value="allrecords">
            <UnifiedRecords 
              isDarkMode={isDarkMode}
              salesData={salesData}
              creditData={creditData}
              incomeData={incomeData}
              expenseData={expenseData}
              selectedDate={selectedDate}
              onEditSale={handleEditSale}
              deleteSaleRecord={deleteSaleRecord}
              onEditCredit={handleEditCredit}
              deleteCreditRecord={deleteCreditRecord}
              onEditIncome={(record) => handleEditIncomeExpense(record, 'income')}
              deleteIncomeRecord={deleteIncomeRecord}
              onEditExpense={(record) => handleEditIncomeExpense(record, 'expense')}
              deleteExpenseRecord={deleteExpenseRecord}
            />
          </TabsContent>

          <TabsContent value="prices">
            <PriceConfiguration 
              isDarkMode={isDarkMode}
              fuelSettings={fuelSettings}
              updateFuelRate={updateFuelRate}
              selectedDate={selectedDate}
              salesData={salesData}
              creditData={creditData}
              incomeData={incomeData}
              expenseData={expenseData}
            />
          </TabsContent>
        </Tabs>

        {/* PDF Settings Dialog */}
        <Sheet open={pdfSettingsOpen} onOpenChange={setPdfSettingsOpen}>
          <SheetContent side="right" className={`w-full sm:max-w-md ${
            isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'
          }`}>
            <SheetHeader>
              <SheetTitle className={isDarkMode ? 'text-white' : 'text-slate-800'}>
                PDF Export Settings
              </SheetTitle>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {/* Content Selection */}
              <div className="space-y-3">
                <Label className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  Include in PDF
                </Label>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="includeSummary"
                      checked={pdfSettings.includeSummary}
                      onChange={(e) => setPdfSettings({...pdfSettings, includeSummary: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="includeSummary" className={isDarkMode ? 'text-gray-300' : 'text-slate-700'}>
                      Summary
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="includeSales"
                      checked={pdfSettings.includeSales}
                      onChange={(e) => setPdfSettings({...pdfSettings, includeSales: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="includeSales" className={isDarkMode ? 'text-gray-300' : 'text-slate-700'}>
                      Reading Sales
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="includeCredit"
                      checked={pdfSettings.includeCredit}
                      onChange={(e) => setPdfSettings({...pdfSettings, includeCredit: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="includeCredit" className={isDarkMode ? 'text-gray-300' : 'text-slate-700'}>
                      Credit Sales
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="includeIncome"
                      checked={pdfSettings.includeIncome}
                      onChange={(e) => setPdfSettings({...pdfSettings, includeIncome: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="includeIncome" className={isDarkMode ? 'text-gray-300' : 'text-slate-700'}>
                      Income
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="includeExpense"
                      checked={pdfSettings.includeExpense}
                      onChange={(e) => setPdfSettings({...pdfSettings, includeExpense: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="includeExpense" className={isDarkMode ? 'text-gray-300' : 'text-slate-700'}>
                      Expenses
                    </Label>
                  </div>
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-3">
                <Label className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  Date Selection
                </Label>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="singleDate"
                      name="dateRange"
                      checked={pdfSettings.dateRange === 'single'}
                      onChange={() => setPdfSettings({...pdfSettings, dateRange: 'single', startDate: selectedDate, endDate: selectedDate})}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="singleDate" className={isDarkMode ? 'text-gray-300' : 'text-slate-700'}>
                      Current Date ({selectedDate})
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="dateRange"
                      name="dateRange"
                      checked={pdfSettings.dateRange === 'range'}
                      onChange={() => setPdfSettings({...pdfSettings, dateRange: 'range'})}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="dateRange" className={isDarkMode ? 'text-gray-300' : 'text-slate-700'}>
                      Date Range
                    </Label>
                  </div>

                  {pdfSettings.dateRange === 'range' && (
                    <div className="pl-6 space-y-2">
                      <div>
                        <Label className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                          Start Date
                        </Label>
                        <Input
                          type="date"
                          value={pdfSettings.startDate}
                          onChange={(e) => setPdfSettings({...pdfSettings, startDate: e.target.value})}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                          End Date
                        </Label>
                        <Input
                          type="date"
                          value={pdfSettings.endDate}
                          onChange={(e) => setPdfSettings({...pdfSettings, endDate: e.target.value})}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Format Options */}
              <div className="space-y-3">
                <Label className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  PDF Format
                </Label>
                
                <div>
                  <Label className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                    Page Size
                  </Label>
                  <select
                    value={pdfSettings.pageSize}
                    onChange={(e) => setPdfSettings({...pdfSettings, pageSize: e.target.value})}
                    className={`w-full mt-1 px-3 py-2 rounded-md border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="a4">A4 (210 x 297 mm)</option>
                    <option value="letter">Letter (216 x 279 mm)</option>
                    <option value="a5">A5 (148 x 210 mm)</option>
                  </select>
                </div>

                <div>
                  <Label className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                    Orientation
                  </Label>
                  <select
                    value={pdfSettings.orientation}
                    onChange={(e) => setPdfSettings({...pdfSettings, orientation: e.target.value})}
                    className={`w-full mt-1 px-3 py-2 rounded-md border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setPdfSettingsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    setPdfSettingsOpen(false);
                    generateDirectPDF();
                  }}
                >
                  Generate PDF
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

      </div>
    </div>
  );
};

export default ZAPTRStyleCalculator;