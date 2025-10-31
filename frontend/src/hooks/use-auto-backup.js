import { useEffect, useRef } from 'react';
import localStorageService from '../services/localStorage';

/**
 * Hook to automatically backup data to selected folder when data changes
 * Only works in Chrome/Edge with File System Access API
 */
export const useAutoBackup = (salesData, creditData, incomeData, expenseData, fuelSettings) => {
  const lastDataRef = useRef(null);
  const backupTimeoutRef = useRef(null);

  useEffect(() => {
    // Check if auto-backup is enabled
    const settings = localStorage.getItem('mpump_auto_backup_settings');
    if (!settings) return;

    const parsed = JSON.parse(settings);
    if (!parsed.enabled) return;

    // Create current data snapshot
    const currentData = JSON.stringify({
      salesData,
      creditData,
      incomeData,
      expenseData,
      fuelSettings
    });

    // Check if data changed
    if (lastDataRef.current && lastDataRef.current !== currentData) {
      // Clear previous timeout
      if (backupTimeoutRef.current) {
        clearTimeout(backupTimeoutRef.current);
      }

      // Debounce: Wait 5 seconds before backing up
      backupTimeoutRef.current = setTimeout(async () => {
        try {
          // Check if File System Access API is supported
          if (!('showDirectoryPicker' in window)) return;

          // Open IndexedDB to get folder handle
          const db = await openBackupDB();
          const dirHandle = await db.get('folderHandles', 'autoBackupFolder');
          
          if (!dirHandle) return;

          // Request permission
          const permission = await dirHandle.queryPermission({ mode: 'readwrite' });
          if (permission !== 'granted') {
            const newPermission = await dirHandle.requestPermission({ mode: 'readwrite' });
            if (newPermission !== 'granted') return;
          }

          // Perform backup
          const backupData = localStorageService.exportAllData();
          const dataStr = JSON.stringify(backupData, null, 2);
          const fileName = `mpump-backup-${new Date().toISOString().split('T')[0]}.json`;
          
          const fileHandle = await dirHandle.getFileHandle(fileName, { create: true });
          const writable = await fileHandle.createWritable();
          await writable.write(dataStr);
          await writable.close();

          // Update last backup time
          const now = new Date().toISOString();
          parsed.lastBackupTime = now;
          localStorage.setItem('mpump_auto_backup_settings', JSON.stringify(parsed));

          console.log('✅ Auto-backup completed:', fileName);
        } catch (error) {
          console.error('Auto-backup failed:', error);
        }
      }, 5000); // 5 second debounce
    }

    // Update last data reference
    lastDataRef.current = currentData;

  }, [salesData, creditData, incomeData, expenseData, fuelSettings]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (backupTimeoutRef.current) {
        clearTimeout(backupTimeoutRef.current);
      }
    };
  }, []);
};

// Helper function to open IndexedDB
const openBackupDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MPumpBackupDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      resolve({
        get: (storeName, key) => {
          return new Promise((res, rej) => {
            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const getRequest = store.get(key);
            getRequest.onsuccess = () => res(getRequest.result);
            getRequest.onerror = () => rej(getRequest.error);
          });
        }
      });
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('folderHandles')) {
        db.createObjectStore('folderHandles');
      }
    };
  });
};

export default useAutoBackup;
