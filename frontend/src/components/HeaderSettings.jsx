import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Settings as SettingsIcon,
  Fuel,
  Plus,
  Minus,
  Trash2,
  Save,
  RotateCcw,
  Gauge,
  User,
  Phone,
  MapPin,
  Download,
  Mail
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import localStorageService from '../services/localStorage';

const HeaderSettings = ({ isDarkMode, fuelSettings, setFuelSettings }) => {
  const [newFuelType, setNewFuelType] = useState('');
  const [currentView, setCurrentView] = useState('dropdown'); // Only 'dropdown' needed now
  const { toast } = useToast();

  // Employee management removed

  // Owner details state removed

  // Contact information state (static display)
  const [contactInfo, setContactInfo] = useState({
    pumpName: 'Vishnu Parvati Petroleum',
    dealerName: 'Rohan.R.Khandve',
    address: 'Station Road, Near City Mall, Mumbai - 400001',
    phone: '+91 9822026207',
    email: 'vishnuparvatipetroleum@gmail.com'
  });

  // Auto-backup folder state
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(false);
  const [backupFolderName, setBackupFolderName] = useState('');
  const [lastBackupTime, setLastBackupTime] = useState(null);

  // Load auto-backup settings from localStorage
  React.useEffect(() => {
    const settings = localStorage.getItem('mpump_auto_backup_settings');
    if (settings) {
      const parsed = JSON.parse(settings);
      setAutoBackupEnabled(parsed.enabled || false);
      setBackupFolderName(parsed.folderName || '');
      setLastBackupTime(parsed.lastBackupTime || null);
    }
  }, []);

  // Handle Android import callback
  useEffect(() => {
    // Set up global function for Android to call
    window.handleAndroidImport = (jsonData) => {
      try {
        const importedData = JSON.parse(jsonData);
        
        // Validate data structure
        if (!importedData.salesData && !importedData.creditData && 
            !importedData.incomeData && !importedData.expenseData) {
          toast({
            title: "Invalid Backup File",
            description: "The file doesn't contain valid backup data",
            variant: "destructive",
          });
          return;
        }
        
        // Import data
        const success = localStorageService.importAllData(importedData);
        
        if (success) {
          toast({
            title: "Data Imported Successfully",
            description: "Your backup has been restored. Refreshing...",
          });
          
          // Refresh page after 2 seconds
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          toast({
            title: "Import Failed",
            description: "Failed to import data. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Import Error",
          description: "Failed to read backup file. Please ensure it's a valid JSON file.",
          variant: "destructive",
        });
        console.error('Import error:', error);
      }
    };
    
    // Cleanup
    return () => {
      delete window.handleAndroidImport;
    };
  }, [toast]);

  const updateNozzleCount = (fuelType, delta) => {
    const newSettings = {
      ...fuelSettings,
      [fuelType]: {
        ...fuelSettings[fuelType],
        nozzleCount: Math.max(1, Math.min(10, fuelSettings[fuelType].nozzleCount + delta))
      }
    };
    
    setFuelSettings(newSettings);
    localStorageService.setFuelSettings(newSettings);
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

    // Use a default price of 100 when adding new fuel type
    // Price will be set in the Price Configuration tab
    const newSettings = {
      ...fuelSettings,
      [newFuelType]: {
        price: 100.00, // Default price, will be configured in Price tab
        nozzleCount: 2
      }
    };
    
    setFuelSettings(newSettings);
    localStorageService.setFuelSettings(newSettings);
    setNewFuelType('');
    
    toast({
      title: "Fuel Type Added",
      description: `${newFuelType} has been added successfully. Set the rate in the Rate tab.`,
    });
  };

  const removeFuelType = (fuelType) => {
    const { [fuelType]: removed, ...newSettings } = fuelSettings;
    
    setFuelSettings(newSettings);
    localStorageService.setFuelSettings(newSettings);
    
    toast({
      title: "Fuel Type Removed",
      description: `${fuelType} has been removed successfully`,
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
      description: "Fuel settings have been reset to defaults",
    });
  };

  // Employee management functions removed

  // Owner details functions removed

  // Employee form handlers removed

  const handleNewFuelTypeChange = useCallback((e) => {
    setNewFuelType(e.target.value);
  }, []);

  // Setup auto-backup folder
  const setupAutoBackupFolder = async () => {
    try {
      // Check if File System Access API is supported
      if (!('showDirectoryPicker' in window)) {
        toast({
          title: "Not Supported",
          description: "Auto-backup requires Chrome/Edge browser version 86+",
          variant: "destructive",
        });
        return;
      }

      // Ask user to select a folder
      const dirHandle = await window.showDirectoryPicker({
        mode: 'readwrite',
        startIn: 'documents'
      });

      // Test write permission
      await dirHandle.requestPermission({ mode: 'readwrite' });

      // Save folder handle (note: can't directly serialize handle)
      // We'll store folder name and request permission each time
      const folderName = dirHandle.name;
      
      // Store settings
      const settings = {
        enabled: true,
        folderName: folderName,
        lastBackupTime: new Date().toISOString()
      };
      
      localStorage.setItem('mpump_auto_backup_settings', JSON.stringify(settings));
      localStorage.setItem('mpump_backup_folder_handle', 'granted'); // Flag to indicate permission was granted
      
      // Store the handle in a way we can retrieve it (IndexedDB)
      const db = await openBackupDB();
      await db.put('folderHandles', dirHandle, 'autoBackupFolder');
      
      setAutoBackupEnabled(true);
      setBackupFolderName(folderName);
      
      // Perform initial backup
      await performAutoBackup(dirHandle);
      
      toast({
        title: "Auto-Backup Enabled",
        description: `Backups will be saved to: ${folderName}`,
      });

    } catch (error) {
      if (error.name === 'AbortError') {
        toast({
          title: "Cancelled",
          description: "Folder selection was cancelled",
        });
      } else {
        console.error('Auto-backup setup error:', error);
        toast({
          title: "Setup Failed",
          description: "Could not setup auto-backup folder. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Disable auto-backup
  const disableAutoBackup = () => {
    localStorage.removeItem('mpump_auto_backup_settings');
    localStorage.removeItem('mpump_backup_folder_handle');
    setAutoBackupEnabled(false);
    setBackupFolderName('');
    setLastBackupTime(null);
    
    toast({
      title: "Auto-Backup Disabled",
      description: "Automatic backups have been turned off",
    });
  };

  // Perform auto backup
  const performAutoBackup = async (dirHandle) => {
    try {
      const backupData = localStorageService.exportAllData();
      const dataStr = JSON.stringify(backupData, null, 2);
      const fileName = `mpump-backup-${new Date().toISOString().split('T')[0]}.json`;
      
      // Create/overwrite file in the selected folder
      const fileHandle = await dirHandle.getFileHandle(fileName, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(dataStr);
      await writable.close();
      
      const now = new Date().toISOString();
      setLastBackupTime(now);
      
      // Update settings
      const settings = JSON.parse(localStorage.getItem('mpump_auto_backup_settings') || '{}');
      settings.lastBackupTime = now;
      localStorage.setItem('mpump_auto_backup_settings', JSON.stringify(settings));
      
      return true;
    } catch (error) {
      console.error('Auto-backup failed:', error);
      return false;
    }
  };

  // Manual backup to selected folder
  const manualBackupToFolder = async () => {
    try {
      // Get stored folder handle from IndexedDB
      const db = await openBackupDB();
      const dirHandle = await db.get('folderHandles', 'autoBackupFolder');
      
      if (!dirHandle) {
        toast({
          title: "No Folder Selected",
          description: "Please setup auto-backup folder first",
          variant: "destructive",
        });
        return;
      }

      // Request permission again (in case it was revoked)
      const permission = await dirHandle.requestPermission({ mode: 'readwrite' });
      if (permission !== 'granted') {
        toast({
          title: "Permission Denied",
          description: "Please grant folder access permission",
          variant: "destructive",
        });
        return;
      }

      const success = await performAutoBackup(dirHandle);
      
      if (success) {
        toast({
          title: "Backup Successful",
          description: `Saved to: ${backupFolderName}`,
        });
      } else {
        toast({
          title: "Backup Failed",
          description: "Could not save backup file",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Manual backup error:', error);
      toast({
        title: "Backup Failed",
        description: "Could not access backup folder. Please setup again.",
        variant: "destructive",
      });
    }
  };

  // Helper function to open IndexedDB for storing folder handles
  const openBackupDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('MPumpBackupDB', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('folderHandles')) {
          db.createObjectStore('folderHandles');
        }
      };
    });
  };

  // saveOwnerDetails function removed

  // Contact information functions
  const updateContactInfo = (field, value) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
  };

  const saveContactInfo = () => {
    toast({
      title: "Contact Information Saved",
      description: "Contact information has been updated successfully",
    });
  };

  // Owner Details component removed

  // Fuel Types component removed - now inline

  // Employees component removed

  // Contact component removed - now inline

  // No separate views needed - everything in dropdown

  // Inline dropdown view with tabs
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2"
        >
          <SettingsIcon className="w-4 h-4" />
          Settings
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-96 p-0" 
        align="start"
        sideOffset={5}
      >
        <Card className={`border-0 shadow-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-lg">
              <SettingsIcon className="w-5 h-5" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="fuel" className="w-full">
              <TabsList className={`grid w-full grid-cols-2 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <TabsTrigger value="fuel" className="flex items-center gap-2">
                  <Fuel className="w-4 h-4" />
                  Fuel Types
                </TabsTrigger>
                <TabsTrigger value="contact" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Contact
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="fuel" className="p-4 max-h-80 overflow-y-auto">
                {/* Add New Fuel Type */}
                <div className="space-y-3 mb-4">
                  <Label className="text-sm font-medium">Add New Fuel Type</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newFuelType}
                      onChange={handleNewFuelTypeChange}
                      placeholder="Enter fuel type name"
                      className="flex-1"
                      autoComplete="off"
                      inputMode="text"
                    />
                    <Button onClick={addFuelType} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Existing Fuel Types */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Configure Fuel Types</Label>
                  {Object.entries(fuelSettings).map(([fuelType, config]) => (
                    <div key={fuelType} className={`border rounded-lg p-3 ${
                      isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-slate-200 bg-slate-50'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-blue-100 text-blue-800 border-0">
                          {fuelType}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFuelType(fuelType)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Nozzles:</span>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateNozzleCount(fuelType, -1)}
                              disabled={config.nozzleCount <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="font-medium w-8 text-center">
                              {config.nozzleCount}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateNozzleCount(fuelType, 1)}
                              disabled={config.nozzleCount >= 10}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Reset Button */}
                <Button
                  variant="outline"
                  onClick={resetToDefaults}
                  className="w-full flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset to Defaults
                </Button>
              </TabsContent>
              
              <TabsContent value="contact" className="p-4">
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-3 bg-blue-100 rounded-full">
                      <Phone className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className={`text-lg font-semibold ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>
                      Contact Information
                    </h3>
                  </div>
                  
                  <div className={`border rounded-lg p-4 ${
                    isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-slate-200 bg-slate-50'
                  }`}>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <div className={`text-xs font-medium ${
                            isDarkMode ? 'text-gray-400' : 'text-slate-600'
                          }`}>
                            Owner
                          </div>
                          <div className={`font-medium ${
                            isDarkMode ? 'text-white' : 'text-slate-800'
                          }`}>
                            {contactInfo.dealerName}
                          </div>
                          <div className={`text-sm ${
                            isDarkMode ? 'text-gray-300' : 'text-slate-600'
                          }`}>
                            {contactInfo.pumpName}
                          </div>
                        </div>
                      </div>
                      
                      <Separator className={isDarkMode ? 'bg-gray-600' : 'bg-slate-200'} />
                      
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-green-600" />
                        <div>
                          <div className={`text-xs font-medium ${
                            isDarkMode ? 'text-gray-400' : 'text-slate-600'
                          }`}>
                            Mobile
                          </div>
                          <div className={`font-medium ${
                            isDarkMode ? 'text-white' : 'text-slate-800'
                          }`}>
                            {contactInfo.phone}
                          </div>
                        </div>
                      </div>
                      
                      <Separator className={isDarkMode ? 'bg-gray-600' : 'bg-slate-200'} />
                      
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-red-600 mt-0.5" />
                        <div>
                          <div className={`text-xs font-medium ${
                            isDarkMode ? 'text-gray-400' : 'text-slate-600'
                          }`}>
                            Email
                          </div>
                          <div className={`font-medium break-all ${
                            isDarkMode ? 'text-white' : 'text-slate-800'
                          }`}>
                            {contactInfo.email}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Data Backup Section */}
                  <Separator className={isDarkMode ? 'bg-gray-600' : 'bg-slate-200'} />
                  
                  <div className={`border rounded-lg p-4 ${
                    isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-slate-200 bg-slate-50'
                  }`}>
                    <div className="space-y-3">
                      <h4 className={`font-medium ${
                        isDarkMode ? 'text-white' : 'text-slate-800'
                      }`}>
                        Manual Backup
                      </h4>
                      
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-slate-600'
                      }`}>
                        Export data manually or copy to clipboard
                      </p>
                      
                      <div className="grid grid-cols-1 gap-2">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={async () => {
                            try {
                              const backupData = localStorageService.exportAllData();
                              const dataStr = JSON.stringify(backupData, null, 2);
                              const fileName = `mpump-backup-${new Date().toISOString().split('T')[0]}.json`;
                              
                              // Check if running in Android WebView
                              const isAndroid = typeof window.MPumpCalcAndroid !== 'undefined';
                              
                              if (isAndroid && window.MPumpCalcAndroid.saveJsonBackup) {
                                // For Android app - use native method
                                window.MPumpCalcAndroid.saveJsonBackup(dataStr, fileName);
                                return;
                              }
                              
                              // Method 1: Try modern File System Access API (for Chrome/Edge)
                              if ('showSaveFilePicker' in window) {
                                try {
                                  const handle = await window.showSaveFilePicker({
                                    suggestedName: fileName,
                                    types: [{
                                      description: 'JSON Backup File',
                                      accept: { 'application/json': ['.json'] }
                                    }]
                                  });
                                  const writable = await handle.createWritable();
                                  await writable.write(dataStr);
                                  await writable.close();
                                  
                                  toast({
                                    title: "Data Exported",
                                    description: "Your backup file has been saved successfully",
                                  });
                                  return;
                                } catch (err) {
                                  if (err.name === 'AbortError') {
                                    toast({
                                      title: "Export Cancelled",
                                      description: "You cancelled the file save",
                                    });
                                    return;
                                  }
                                  console.log('File System API failed, trying fallback:', err);
                                }
                              }
                              
                              // Method 2: Traditional download link (fallback)
                              const dataBlob = new Blob([dataStr], {type: 'application/json'});
                              const url = URL.createObjectURL(dataBlob);
                              const link = document.createElement('a');
                              link.href = url;
                              link.download = fileName;
                              link.style.display = 'none';
                              
                              document.body.appendChild(link);
                              link.click();
                              
                              // Cleanup
                              setTimeout(() => {
                                document.body.removeChild(link);
                                URL.revokeObjectURL(url);
                              }, 100);
                              
                              toast({
                                title: "Data Exported",
                                description: "Your backup file has been downloaded",
                              });
                              
                            } catch (error) {
                              console.error('Export error:', error);
                              toast({
                                title: "Export Failed",
                                description: "Could not download backup file. Try 'Copy Backup Data' button instead.",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          💾 Export Data Backup
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            try {
                              const backupData = localStorageService.exportAllData();
                              const dataStr = JSON.stringify(backupData, null, 2);
                              
                              navigator.clipboard.writeText(dataStr).then(() => {
                                toast({
                                  title: "Backup Data Copied",
                                  description: "Backup data copied to clipboard. Paste it into a text file and save as .json",
                                });
                              }).catch(() => {
                                // Fallback for older browsers
                                const textArea = document.createElement('textarea');
                                textArea.value = dataStr;
                                textArea.style.position = 'fixed';
                                textArea.style.left = '-999999px';
                                document.body.appendChild(textArea);
                                textArea.select();
                                
                                try {
                                  document.execCommand('copy');
                                  toast({
                                    title: "Backup Data Copied",
                                    description: "Backup data copied to clipboard. Paste it into a text file and save as .json",
                                  });
                                } catch (err) {
                                  toast({
                                    title: "Copy Failed",
                                    description: "Could not copy to clipboard. Please enable clipboard permissions.",
                                    variant: "destructive",
                                  });
                                }
                                
                                document.body.removeChild(textArea);
                              });
                              
                            } catch (error) {
                              console.error('Copy error:', error);
                              toast({
                                title: "Copy Failed",
                                description: "Could not copy backup data",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          📋 Copy Backup Data
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            // Check if running in Android WebView
                            const isAndroid = typeof window.MPumpCalcAndroid !== 'undefined';
                            
                            if (isAndroid && window.MPumpCalcAndroid.selectJsonBackup) {
                              // For Android app - use native file picker
                              window.MPumpCalcAndroid.selectJsonBackup();
                              return;
                            }
                            
                            // For web browser - use file input
                            const fileInput = document.createElement('input');
                            fileInput.type = 'file';
                            fileInput.accept = '.json,application/json';
                            
                            fileInput.onchange = (e) => {
                              const file = e.target.files[0];
                              if (!file) return;
                              
                              // Check file type
                              if (!file.name.endsWith('.json')) {
                                toast({
                                  title: "Invalid File",
                                  description: "Please select a valid JSON backup file",
                                  variant: "destructive",
                                });
                                return;
                              }
                              
                              // Read file
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                try {
                                  const importedData = JSON.parse(event.target.result);
                                  
                                  // Validate data structure
                                  if (!importedData.salesData && !importedData.creditData && 
                                      !importedData.incomeData && !importedData.expenseData) {
                                    toast({
                                      title: "Invalid Backup File",
                                      description: "The file doesn't contain valid backup data",
                                      variant: "destructive",
                                    });
                                    return;
                                  }
                                  
                                  // Confirm import
                                  if (window.confirm('This will replace all existing data. Are you sure you want to continue?')) {
                                    const success = localStorageService.importAllData(importedData);
                                    
                                    if (success) {
                                      toast({
                                        title: "Data Imported Successfully",
                                        description: "Your backup has been restored. Please refresh the page to see changes.",
                                      });
                                      
                                      // Refresh page after 2 seconds
                                      setTimeout(() => {
                                        window.location.reload();
                                      }, 2000);
                                    } else {
                                      toast({
                                        title: "Import Failed",
                                        description: "Failed to import data. Please try again.",
                                        variant: "destructive",
                                      });
                                    }
                                  }
                                } catch (error) {
                                  toast({
                                    title: "Import Error",
                                    description: "Failed to read backup file. Please ensure it's a valid JSON file.",
                                    variant: "destructive",
                                  });
                                  console.error('Import error:', error);
                                }
                              };
                              
                              reader.readAsText(file);
                            };
                            
                            // Trigger file selection
                            fileInput.click();
                          }}
                        >
                          📥 Import Data Backup
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            const storageInfo = localStorageService.getStorageInfo();
                            
                            toast({
                              title: "Storage Information",
                              description: `Using ${Math.round(storageInfo.usagePercent)}% of browser storage (${storageInfo.itemCount} items)`,
                            });
                          }}
                        >
                          📊 Check Storage Usage
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
            </Tabs>
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderSettings;