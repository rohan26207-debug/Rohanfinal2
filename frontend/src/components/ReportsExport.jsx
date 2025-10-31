import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { 
  FileText, 
  Download,
  Calendar,
  Filter,
  BarChart3,
  IndianRupee,
  Fuel,
  CreditCard,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
// Paste this entire block into ReportsExport.jsx before the `return`

const generatePdfData = async () => {
    return new Promise(async (resolve) => {
        console.log("Starting data preparation...");
        await new Promise(res => setTimeout(res, 300)); // Crucial delay for data rendering

        const fileName = 'MPumpCalc-Report.pdf';
        const pdfElement = document.getElementById('report-data-container');

        const pdfOptions = {
            margin: 0.2,
            filename: fileName,
            image: { type: 'jpeg', quality: 0.98 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
            html2canvas: {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                onrendered: function (canvas) {
                    return new Promise(function (resolveCanvas) {
                        setTimeout(() => resolveCanvas(canvas), 500); // Delay for fonts
                    });
                }
            }
        };

        const pdfBase64String = await html2pdf().set(pdfOptions).from(pdfElement).output('datauristring');
        const base64 = pdfBase64String.split('base64,')[1];
        console.log("Data preparation is complete.");
        resolve({ base64, fileName });
    });
};
// Add these two new functions right after generatePdfData

const handlePrint = async () => {
    try {
        setLoading(true);
        const { base64, fileName } = await generatePdfData(); // Wait for data
        if (window.MPumpCalcAndroid && typeof window.MPumpCalcAndroid.printPdf === 'function') {
            window.MPumpCalcAndroid.printPdf(base64, fileName);
        } else {
            console.error("Android 'printPdf' interface not available.");
        }
    } catch (error) {
        console.error("Print Error:", error);
    } finally {
        setLoading(false);
    }
};

const handleDownload = async () => {
    try {
        setLoading(true);
        const { base64, fileName } = await generatePdfData(); // Wait for data
        if (window.MPumpCalcAndroid && typeof window.MPumpCalcAndroid.openPdfWithViewer === 'function') {
            window.MPumpCalcAndroid.openPdfWithViewer(base64, fileName);
        } else {
            console.error("Android 'openPdfWithViewer' interface not available.");
        }
    } catch (error) {
        console.error("PDF Download Error:", error);
    } finally {
        setLoading(false);
    }
};

const ReportsExport = ({ isDarkMode, salesData, creditData, incomeData, expenseData }) => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [reportType, setReportType] = useState('summary');
  const { toast } = useToast();

  // Filter data by date range
  const filterByDateRange = (data) => {
    return data.filter(item => {
      const itemDate = new Date(item.date);
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      return itemDate >= start && itemDate <= end;
    });
  };

  const filteredSales = filterByDateRange(salesData);
  const filteredCredits = filterByDateRange(creditData);
  const filteredIncome = filterByDateRange(incomeData);
  const filteredExpenses = filterByDateRange(expenseData);

  // Calculate summary statistics
  const getSummaryStats = () => {
    const totalSalesAmount = filteredSales.reduce((sum, sale) => sum + sale.amount, 0);
    const totalSalesLiters = filteredSales.reduce((sum, sale) => sum + sale.liters, 0);
    const totalCreditAmount = filteredCredits.reduce((sum, credit) => sum + credit.amount, 0);
    const totalCreditLiters = filteredCredits.reduce((sum, credit) => sum + credit.liters, 0);
    const totalIncome = filteredIncome.reduce((sum, income) => sum + income.amount, 0);
    const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const netProfit = (totalSalesAmount + totalIncome) - totalExpenses;
    // Add this new function inside your ReportData component in ReportData.js

const generatePdfData = async () => {
    return new Promise(async (resolve) => {
        console.log("Starting data preparation...");

        // A crucial delay to ensure the browser has rendered all the latest data.
        // This is the key to synchronizing the data.
        await new Promise(res => setTimeout(res, 300)); // 300ms delay

        console.log("Summary data is now assumed to be rendered in the HTML.");

        // Define the PDF options
        const fileName = 'MPumpCalc-Report.pdf';
        const pdfElement = document.getElementById('report-data-container'); // This is the ID of your report's div

        const pdfOptions = {
            margin: 0.2,
            filename: fileName,
            image: { type: 'jpeg', quality: 0.98 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
            html2canvas: {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                // This delay gives fonts time to load before the "screenshot" is taken.
                // This fixes the "broken numbers" issue.
                onrendered: function (canvas) {
                    return new Promise(function (resolveCanvas) {
                        setTimeout(() => resolveCanvas(canvas), 500); // 500ms delay for fonts
                    });
                }
            }
        };

        // Generate the PDF as a base64 string
        console.log("Generating base64 string from HTML...");
        const pdfBase64String = await html2pdf().set(pdfOptions).from(pdfElement).output('datauristring');
        const base64 = pdfBase64String.split('base64,')[1];

        console.log("Data preparation is complete.");
        resolve({ base64, fileName });
    });
};

    return {
      totalSalesAmount,
      totalSalesLiters,
      totalCreditAmount,
      totalCreditLiters,
      totalIncome,
      totalExpenses,
      netProfit,
      totalRevenue: totalSalesAmount + totalCreditAmount + totalIncome
    };
  };

  const stats = getSummaryStats();

  // Generate CSV content
  const generateCSV = (type) => {
    let csvContent = '';
    let headers = [];
    let rows = [];

    switch (type) {
      case 'sales':
        headers = ['Date', 'Nozzle', 'Fuel Type', 'Start Reading', 'End Reading', 'Liters', 'Rate', 'Amount', 'Type'];
        rows = filteredSales.map(sale => [
          sale.date,
          sale.nozzle,
          sale.fuelType,
          sale.startReading,
          sale.endReading,
          sale.liters,
          sale.rate,
          sale.amount,
          sale.type
        ]);
        break;
      
      case 'credit':
        headers = ['Date', 'Customer', 'Vehicle', 'Fuel Type', 'Liters', 'Rate', 'Amount', 'Due Date', 'Status'];
        rows = filteredCredits.map(credit => [
          credit.date,
          credit.customerName,
          credit.vehicleNumber || '',
          credit.fuelType,
          credit.liters,
          credit.rate,
          credit.amount,
          credit.dueDate || '',
          credit.status
        ]);
        break;
      
      case 'income':
        headers = ['Date', 'Category', 'Amount', 'Description'];
        rows = filteredIncome.map(income => [
          income.date,
          income.category,
          income.amount,
          income.description || ''
        ]);
        break;
      
      case 'expenses':
        headers = ['Date', 'Category', 'Amount', 'Description'];
        rows = filteredExpenses.map(expense => [
          expense.date,
          expense.category,
          expense.amount,
          expense.description || ''
        ]);
        break;
      
      case 'summary':
        headers = ['Metric', 'Value'];
        rows = [
          ['Total Sales Amount', `₹${stats.totalSalesAmount.toFixed(2)}`],
          ['Total Sales Liters', `${stats.totalSalesLiters.toFixed(2)}`],
          ['Total Credit Amount', `₹${stats.totalCreditAmount.toFixed(2)}`],
          ['Total Credit Liters', `${stats.totalCreditLiters.toFixed(2)}`],
          ['Total Income', `₹${stats.totalIncome.toFixed(2)}`],
          ['Total Expenses', `₹${stats.totalExpenses.toFixed(2)}`],
          ['Net Profit', `₹${stats.netProfit.toFixed(2)}`],
          ['Total Revenue', `₹${stats.totalRevenue.toFixed(2)}`]
        ];
        break;
    }

    csvContent = headers.join(',') + '\n';
    csvContent += rows.map(row => row.join(',')).join('\n');

    return csvContent;
  };

  const downloadCSV = (type) => {
    const csvContent = generateCSV(type);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-report-${dateRange.startDate}-to-${dateRange.endDate}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} report downloaded successfully`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <Card className={`${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
      } shadow-lg`}>
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Start Date</Label>
              <Input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">End Date</Label>
              <Input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Summary Report</SelectItem>
                  <SelectItem value="sales">Sales Report</SelectItem>
                  <SelectItem value="credit">Credit Report</SelectItem>
                  <SelectItem value="income">Income Report</SelectItem>
                  <SelectItem value="expenses">Expenses Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className={`${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
        } shadow-lg`}>
          <CardContent className="p-4 text-center">
            <IndianRupee className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="text-sm text-slate-600">Total Sales</p>
            <p className="text-xl font-bold text-green-600">₹{stats.totalSalesAmount.toFixed(2)}</p>
            <p className="text-xs text-slate-500">{stats.totalSalesLiters.toFixed(2)}L</p>
          </CardContent>
        </Card>

        <Card className={`${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
        } shadow-lg`}>
          <CardContent className="p-4 text-center">
            <CreditCard className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <p className="text-sm text-slate-600">Credit Sales</p>
            <p className="text-xl font-bold text-orange-600">₹{stats.totalCreditAmount.toFixed(2)}</p>
            <p className="text-xs text-slate-500">{stats.totalCreditLiters.toFixed(2)}L</p>
          </CardContent>
        </Card>

        <Card className={`${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
        } shadow-lg`}>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="text-sm text-slate-600">Total Income</p>
            <p className="text-xl font-bold text-blue-600">₹{stats.totalIncome.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card className={`${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
        } shadow-lg`}>
          <CardContent className="p-4 text-center">
            <TrendingDown className="w-8 h-8 mx-auto mb-2 text-red-600" />
            <p className="text-sm text-slate-600">Total Expenses</p>
            <p className="text-xl font-bold text-red-600">₹{stats.totalExpenses.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Net Profit Card */}
      <Card className={`${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
      } shadow-lg`}>
        <CardContent className="p-6">
          <div className="text-center">
            <BarChart3 className={`w-12 h-12 mx-auto mb-4 ${
              stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
            }`} />
            <h3 className="text-2xl font-bold mb-2">Net Profit Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-slate-600">Total Revenue</p>
                <p className="text-2xl font-bold text-blue-600">
                  ₹{stats.totalRevenue.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">
                  ₹{stats.totalExpenses.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Net Profit</p>
                <p className={`text-3xl font-bold ${
                  stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ₹{stats.netProfit.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Buttons */}
      <Card className={`${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
      } shadow-lg`}>
        <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Reports
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Button 
              onClick={() => downloadCSV('summary')}
              className="flex flex-col items-center gap-2 h-auto p-4 bg-blue-600 hover:bg-blue-700"
            >
              <BarChart3 className="w-6 h-6" />
              <span className="text-sm">Summary Report</span>
            </Button>

            <Button 
              onClick={() => downloadCSV('sales')}
              className="flex flex-col items-center gap-2 h-auto p-4 bg-green-600 hover:bg-green-700"
            >
              <Fuel className="w-6 h-6" />
              <span className="text-sm">Sales Report</span>
            </Button>

            <Button 
              onClick={() => downloadCSV('credit')}
              className="flex flex-col items-center gap-2 h-auto p-4 bg-orange-600 hover:bg-orange-700"
            >
              <CreditCard className="w-6 h-6" />
              <span className="text-sm">Credit Report</span>
            </Button>

            <Button 
              onClick={() => downloadCSV('income')}
              className="flex flex-col items-center gap-2 h-auto p-4 bg-teal-600 hover:bg-teal-700"
            >
              <TrendingUp className="w-6 h-6" />
              <span className="text-sm">Income Report</span>
            </Button>

            <Button 
              onClick={() => downloadCSV('expenses')}
              className="flex flex-col items-center gap-2 h-auto p-4 bg-red-600 hover:bg-red-700"
            >
              <TrendingDown className="w-6 h-6" />
              <span className="text-sm">Expense Report</span>
            </Button>
          </div>

          <Separator className="my-6" />

          <div className="text-center space-y-2">
            <p className="text-sm text-slate-600">
              Reports will be exported as CSV files for the selected date range
            </p>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {dateRange.startDate} to {dateRange.endDate}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsExport;
