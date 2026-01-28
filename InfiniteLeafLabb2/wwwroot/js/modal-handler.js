/**
 * Modal Handler for Create/Edit/Delete Operations
 * Manages modal state, form generation, and data submission
 */
class ModalHandler {
    constructor() {
        this.modal = document.getElementById('crud-modal');
        this.deleteModal = document.getElementById('delete-confirm-modal');
        this.currentEntity = null;
        this.currentMode = null;
        this.currentId = null;
        this.currentData = null;

        this.initializeEventListeners();
    }

    /**
     * Initialize modal event listeners
     */
    initializeEventListeners() {
        // Close buttons
        document.getElementById('modal-close')?.addEventListener('click', () => this.close());
        document.getElementById('modal-cancel')?.addEventListener('click', () => this.close());

        // Delete modal buttons
        document.getElementById('delete-cancel')?.addEventListener('click', () => this.closeDeleteModal());
        document.getElementById('delete-confirm')?.addEventListener('click', () => this.confirmDelete());

        // Close on outside click
        this.modal?.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });

        this.deleteModal?.addEventListener('click', (e) => {
            if (e.target === this.deleteModal) this.closeDeleteModal();
        });

        // Form submission
        document.getElementById('modal-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    /**
     * Open modal for create or edit
     */
    open(entity, mode = 'create', data = null, id = null) {
        this.currentEntity = entity;
        this.currentMode = mode;
        this.currentData = data;
        this.currentId = id;

        this.updateModalContent();
        this.generateForm();
        this.modal.classList.add('show');
    }

    /**
     * Close modal
     */
    close() {
        this.modal.classList.remove('show');
        this.clearForm();
        this.hideError();
    }

    /**
     * Update modal header based on context
     */
    updateModalContent() {
        const icons = {
            tables: '🪑',
            customers: '👥',
            reservations: '📅',
            menu: '🍵'
        };

        const titles = {
            tables: 'Table',
            customers: 'Customer',
            reservations: 'Reservation',
            menu: 'Menu Item'
        };

        const icon = icons[this.currentEntity] || '📝';
        const title = titles[this.currentEntity] || 'Item';
        const action = this.currentMode === 'create' ? 'Create' : 'Edit';

        document.getElementById('modal-icon').textContent = icon;
        document.getElementById('modal-title').textContent = `${action} ${title}`;
        document.getElementById('modal-subtitle').textContent =
            this.currentMode === 'create'
                ? 'Fill in the details below'
                : 'Update the information below';
        document.getElementById('submit-text').textContent =
            this.currentMode === 'create' ? 'Create' : 'Update';
    }

    /**
     * Generate form fields based on entity type
     */
    generateForm() {
        const formFields = document.getElementById('form-fields');
        formFields.innerHTML = '';

        const fields = this.getFieldsForEntity(this.currentEntity);

        fields.forEach(field => {
            const fieldHtml = this.createFormField(field);
            formFields.insertAdjacentHTML('beforeend', fieldHtml);
        });

        // Populate form with existing data if in edit mode
        if (this.currentMode === 'edit' && this.currentData) {
            this.populateForm(this.currentData);
        }
    }

    /**
     * Get field definitions for each entity type
     */
    getFieldsForEntity(entity) {
        const fieldDefinitions = {
            tables: [
                { name: 'tableNumber', label: 'Table Number', type: 'number', required: true, placeholder: 'e.g., 1' },
                { name: 'capacity', label: 'Capacity', type: 'number', required: true, placeholder: 'e.g., 4' }
            ],
            customers: [
                { name: 'name', label: 'Customer Name', type: 'text', required: true, placeholder: 'e.g., John Doe' },
                { name: 'phoneNumber', label: 'Phone Number', type: 'tel', required: true, placeholder: 'e.g., +1-555-0123' }
            ],
            reservations: [
                { name: 'startTime', label: 'Reservation Date & Time', type: 'datetime-local', required: true },
                { name: 'numberOfGuests', label: 'Number of Guests', type: 'number', required: true, placeholder: 'e.g., 4' },
                { name: 'cafeTableId', label: 'Table', type: 'select', required: true, options: [] },
                { name: 'customerId', label: 'Customer', type: 'select', required: true, options: [] }
            ],
            menu: [
                { name: 'name', label: 'Item Name', type: 'text', required: true, placeholder: 'e.g., Green Tea Latte' },
                { name: 'price', label: 'Price', type: 'number', required: true, placeholder: 'e.g., 5.99', step: '0.01' },
                { name: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'Describe the menu item...' },
                { name: 'isPopular', label: 'Popular Item', type: 'checkbox', required: false },
                { name: 'imageUrl', label: 'Image URL', type: 'url', required: false, placeholder: 'https://...' }
            ]
        };

        return fieldDefinitions[entity] || [];
    }

    /**
     * Create HTML for a form field
     */
    createFormField(field) {
        const requiredMark = field.required ? '<span class="required">*</span>' : '';

        let inputHtml = '';

        if (field.type === 'textarea') {
            inputHtml = `<textarea id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''} placeholder="${field.placeholder || ''}"></textarea>`;
        } else if (field.type === 'select') {
            inputHtml = `<select id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>
                <option value="">-- Select ${field.label} --</option>
                ${(field.options || []).map(opt => `<option value="${opt.value}">${opt.text}</option>`).join('')}
            </select>`;
        } else if (field.type === 'checkbox') {
            return `
                <div class="form-field flex items-center gap-3">
                    <input type="checkbox" id="${field.name}" name="${field.name}" class="w-5 h-5 rounded" style="background-color: #18230F; border: 1px solid rgba(37, 95, 56, 0.5);">
                    <label for="${field.name}" class="mb-0">${field.label}</label>
                </div>
            `;
        } else {
            inputHtml = `<input type="${field.type}" id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''} placeholder="${field.placeholder || ''}" ${field.step ? `step="${field.step}"` : ''}>`;
        }

        return `
            <div class="form-field">
                <label for="${field.name}">
                    ${field.label}${requiredMark}
                </label>
                ${inputHtml}
                <div class="field-error">This field is required</div>
            </div>
        `;
    }

    /**
     * Populate form with existing data
     */
    populateForm(data) {
        Object.keys(data).forEach(key => {
            const field = document.getElementById(key);
            if (field) {
                if (field.type === 'checkbox') {
                    field.checked = data[key];
                } else if (field.type === 'datetime-local') {
                    // Format datetime for input
                    const date = new Date(data[key]);
                    field.value = date.toISOString().slice(0, 16);
                } else {
                    field.value = data[key];
                }
            }
        });
    }

    /**
     * Collect form data
     */
    getFormData() {
        const form = document.getElementById('modal-form');
        const formData = new FormData(form);
        const data = {};

        for (let [key, value] of formData.entries()) {
            const field = document.getElementById(key);

            if (field.type === 'number') {
                data[key] = parseFloat(value) || 0;
            } else if (field.type === 'checkbox') {
                data[key] = field.checked;
            } else if (field.type === 'datetime-local') {
                data[key] = new Date(value).toISOString();
            } else {
                data[key] = value;
            }
        }

        return data;
    }

    /**
     * Handle form submission
     */
    async handleSubmit() {
        if (!this.validateForm()) {
            return;
        }

        this.showLoading(true);
        this.hideError();

        const data = this.getFormData();
        let result;

        try {
            if (this.currentMode === 'create') {
                result = await this.createEntity(data);
            } else {
                result = await this.updateEntity(this.currentId, data);
            }

            if (result.success) {
                this.showSuccess();
                this.close();
                // Refresh the data table
                window.adminDashboard?.refreshCurrentSection();
            } else {
                this.showError(result.error);
            }
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.showLoading(false);
        }
    }

    /**
     * Create entity via API
     */
    async createEntity(data) {
        const methods = {
            tables: () => apiClient.createTable(data),
            customers: () => apiClient.createCustomer(data),
            reservations: () => apiClient.createReservation(data),
            menu: () => apiClient.createMenuItem(data)
        };

        return methods[this.currentEntity]?.() || { success: false, error: 'Unknown entity type' };
    }

    /**
     * Update entity via API
     */
    async updateEntity(id, data) {
        const methods = {
            tables: () => apiClient.updateTable(id, data),
            customers: () => apiClient.updateCustomer(id, data),
            reservations: () => apiClient.updateReservation(id, data),
            menu: () => apiClient.updateMenuItem(id, data)
        };

        return methods[this.currentEntity]?.() || { success: false, error: 'Unknown entity type' };
    }

    /**
     * Validate form
     */
    validateForm() {
        const form = document.getElementById('modal-form');
        const fields = form.querySelectorAll('[required]');
        let isValid = true;

        fields.forEach(field => {
            const container = field.closest('.form-field');

            if (!field.value.trim() && field.type !== 'checkbox') {
                container?.classList.add('error');
                isValid = false;
            } else {
                container?.classList.remove('error');
            }
        });

        return isValid;
    }

    /**
     * Clear form
     */
    clearForm() {
        document.getElementById('modal-form')?.reset();
        document.querySelectorAll('.form-field.error').forEach(field => {
            field.classList.remove('error');
        });
    }

    /**
     * Show/hide loading state
     */
    showLoading(show) {
        const loading = document.getElementById('modal-loading');
        if (show) {
            loading?.classList.remove('hidden');
        } else {
            loading?.classList.add('hidden');
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        const errorEl = document.getElementById('modal-error');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.remove('hidden');
        }
    }

    /**
     * Hide error message
     */
    hideError() {
        document.getElementById('modal-error')?.classList.add('hidden');
    }

    /**
     * Show success notification
     */
    showSuccess() {
        // Simple success feedback (could be enhanced with toast notifications)
        console.log('Operation successful');
    }

    // ========== Delete Modal Methods ==========

    /**
     * Open delete confirmation modal
     */
    openDeleteModal(entity, id, itemName) {
        this.currentEntity = entity;
        this.currentId = id;

        const message = `Are you sure you want to delete "${itemName}"? This action cannot be undone.`;
        document.getElementById('delete-message').textContent = message;

        this.deleteModal.classList.add('show');
    }

    /**
     * Close delete modal
     */
    closeDeleteModal() {
        this.deleteModal.classList.remove('show');
    }

    /**
     * Confirm delete action
     */
    async confirmDelete() {
        const loading = document.getElementById('delete-loading');
        loading?.classList.remove('hidden');

        try {
            const result = await this.deleteEntity(this.currentId);

            if (result.success) {
                this.closeDeleteModal();
                window.adminDashboard?.refreshCurrentSection();
            } else {
                alert(`Delete failed: ${result.error}`);
            }
        } catch (error) {
            alert(`Delete failed: ${error.message}`);
        } finally {
            loading?.classList.add('hidden');
        }
    }

    /**
     * Delete entity via API
     */
    async deleteEntity(id) {
        const methods = {
            tables: () => apiClient.deleteTable(id),
            customers: () => apiClient.deleteCustomer(id),
            reservations: () => apiClient.deleteReservation(id),
            menu: () => apiClient.deleteMenuItem(id)
        };

        return methods[this.currentEntity]?.() || { success: false, error: 'Unknown entity type' };
    }
}

// Create and export a singleton instance
const modalHandler = new ModalHandler();