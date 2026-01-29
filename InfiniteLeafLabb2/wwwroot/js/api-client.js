class ApiClient {
    constructor() {
        this.baseUrl = '';
    }

    // Generic request handler with error handling
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(endpoint, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            // Handle different response types
            if (!response.ok) {
                const error = await this.parseError(response);
                throw error;
            }

            // Parse JSON response
            const data = await response.json();
            return { success: true, data };

        } catch (error) {
            console.error('API Request Error:', error);
            return {
                success: false,
                error: error.message || 'An unexpected error occurred'
            };
        }
    }

    // Parse error response
    async parseError(response) {
        try {
            const errorData = await response.json();
            return new Error(errorData.message || `Error: ${response.status}`);
        } catch {
            return new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }
    }

    // GET request
    async get(endpoint) {
        return this.request(endpoint, {
            method: 'GET'
        });
    }

    // POST request
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // PUT request
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // DELETE request
    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }

    // Tables
    //-----------------------------------------
    async getTables() {
        return this.get('/Tables/GetAll');
    }

    async getTable(id) {
        return this.get(`/Tables/GetById?id=${id}`);
    }

    async createTable(data) {
        return this.post('/Tables/Create', data);
    }

    async updateTable(id, data) {
        return this.put(`/Tables/Update?id=${id}`, data);
    }

    async deleteTable(id) {
        return this.delete(`/Tables/Delete?id=${id}`);
    }

    // Customers
    //-----------------------------------------
    async getCustomers() {
        return this.get('/Customers/GetAll');
    }

    async getCustomer(id) {
        return this.get(`/Customers/GetById?id=${id}`);
    }

    async createCustomer(data) {
        return this.post('/Customers/Create', data);
    }

    async updateCustomer(id, data) {
        return this.put(`/Customers/Update?id=${id}`, data);
    }

    async deleteCustomer(id) {
        return this.delete(`/Customers/Delete?id=${id}`);
    }

    // Reservations
    //-----------------------------------------
    async getReservations() {
        return this.get('/Reservations/GetAll');
    }

    async getReservation(id) {
        return this.get(`/Reservations/GetById?id=${id}`);
    }

    async createReservation(data) {
        return this.post('/Reservations/Create', data);
    }

    async updateReservation(id, data) {
        return this.put(`/Reservations/Update?id=${id}`, data);
    }

    async deleteReservation(id) {
        return this.delete(`/Reservations/Delete?id=${id}`);
    }

    // Menu Items
    //-----------------------------------------
    async getMenuItems() {
        return this.get('/MenuItems/GetAll');
    }

    async getMenuItem(id) {
        return this.get(`/MenuItems/GetById?id=${id}`);
    }

    async createMenuItem(data) {
        return this.post('/MenuItems/Create', data);
    }

    async updateMenuItem(id, data) {
        return this.put(`/MenuItems/Update?id=${id}`, data);
    }

    async deleteMenuItem(id) {
        return this.delete(`/MenuItems/Delete?id=${id}`);
    }
}

// Create and export a singleton instance
const apiClient = new ApiClient();