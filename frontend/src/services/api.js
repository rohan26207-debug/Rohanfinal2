const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}/api${endpoint}`;
    
    const defaultOptions = {
      credentials: 'include', // Include cookies for authentication
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const config = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response has content
      const text = await response.text();
      return text ? JSON.parse(text) : {};
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Fuel Sales API
  async getFuelSales(date = null) {
    const query = date ? `?date=${date}` : '';
    return this.request(`/fuel-sales${query}`);
  }

  async createFuelSale(saleData) {
    return this.request('/fuel-sales', {
      method: 'POST',
      body: JSON.stringify(saleData),
    });
  }

  // Credit Sales API
  async getCreditSales(date = null) {
    const query = date ? `?date=${date}` : '';
    return this.request(`/credit-sales${query}`);
  }

  async createCreditSale(saleData) {
    return this.request('/credit-sales', {
      method: 'POST',
      body: JSON.stringify(saleData),
    });
  }

  // Income/Expenses API
  async getIncomeExpenses(date = null) {
    const query = date ? `?date=${date}` : '';
    return this.request(`/income-expenses${query}`);
  }

  async createIncomeExpense(recordData) {
    return this.request('/income-expenses', {
      method: 'POST',
      body: JSON.stringify(recordData),
    });
  }

  // Fuel Rates API
  async getFuelRates(date = null) {
    const query = date ? `?date=${date}` : '';
    return this.request(`/fuel-rates${query}`);
  }

  async createFuelRate(rateData) {
    return this.request('/fuel-rates', {
      method: 'POST',
      body: JSON.stringify(rateData),
    });
  }

  // Authentication API
  async getUser() {
    return this.request('/auth/me');
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // Backup data for sync
  async backupData() {
    return this.request('/sync/backup', {
      method: 'POST',
    });
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;