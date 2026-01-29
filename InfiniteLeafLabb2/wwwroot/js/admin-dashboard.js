class AdminDashboard {
    constructor() {
        this.currentSection = 'tables';
        this.data = {
            tables: [],
            customers: [],
            reservations: [],
            menu: []
        };

        this.initialize();
    }

    
    // Initialize dashboard
     
    async initialize() {
        this.attachEventListeners();
        await this.loadInitialData();
        this.showSection(this.currentSection);
    }

    // Attach event listeners
    attachEventListeners() {
        // Segmented button navigation
        document.querySelectorAll('.segment-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.switchSection(section);
            });
        });

        // Delegate table action buttons
        document.addEventListener('click', (e) => {
            // Create button
            if (e.target.closest('.create-btn')) {
                const entity = e.target.closest('.create-btn').dataset.entity || this.currentSection;
                this.handleCreate(entity);
            }

            // Edit button
            if (e.target.closest('.edit-btn')) {
                const btn = e.target.closest('.edit-btn');
                const id = parseInt(btn.dataset.id);
                const entity = btn.dataset.entity || this.currentSection;
                this.handleEdit(entity, id);
            }

            // Delete button
            if (e.target.closest('.delete-btn')) {
                const btn = e.target.closest('.delete-btn');
                const id = parseInt(btn.dataset.id);
                const entity = btn.dataset.entity || this.currentSection;
                this.handleDelete(entity, id);
            }
        });
    }

    // Load initial data for all sections
    async loadInitialData() {
        const loadingPromises = [
            this.loadTables(),
            this.loadCustomers(),
            this.loadReservations(),
            this.loadMenuItems()
        ];

        await Promise.all(loadingPromises);
    }

    // Load tables data
    async loadTables() {
        const result = await apiClient.getTables();
        if (result.success) {
            this.data.tables = result.data || [];
        }
    }

    // Load customers data
    async loadCustomers() {
        const result = await apiClient.getCustomers();
        if (result.success) {
            this.data.customers = result.data || [];
        }
    }

    // Load reservations data
    async loadReservations() {
        const result = await apiClient.getReservations();
        if (result.success) {
            this.data.reservations = result.data || [];
        }
    }

    // Load menu items data
    async loadMenuItems() {
        const result = await apiClient.getMenuItems();
        if (result.success) {
            this.data.menu = result.data || [];
        }
    }

    // Switch to a different section
    switchSection(section) {
        if (this.currentSection === section) return;

        // Update segment buttons
        document.querySelectorAll('.segment-btn').forEach(btn => {
            if (btn.dataset.section === section) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update current section
        this.currentSection = section;

        // Show section content
        this.showSection(section);
    }

    // Display the selected section
    showSection(section) {
        // Hide all sections
        document.querySelectorAll('.section-content').forEach(el => {
            el.classList.add('hidden');
        });

        // Show selected section
        const sectionElement = document.getElementById(`section-${section}`);
        if (sectionElement) {
            sectionElement.classList.remove('hidden');
            this.renderSection(section);
        }
    }

    // Render section with data
    renderSection(section) {
        const data = this.data[section] || [];
        const tbody = document.querySelector(`#section-${section} tbody`);

        if (!tbody) return;

        if (data.length === 0) {
            this.renderEmptyState(tbody, section);
        } else {
            this.renderTableRows(tbody, section, data);
        }
    }

    // Render empty state
    renderEmptyState(tbody, section) {
        const entityLabels = {
            tables: 'Tables',
            customers: 'Customers',
            reservations: 'Reservations',
            menu: 'Menu Items'
        };

        const label = entityLabels[section] || 'Items';
        const singular = label.slice(0, -1);

        tbody.innerHTML = `
            <tr>
                <td colspan="100" class="px-4 py-8 text-center text-gray-400">
                    <div class="text-4xl mb-2">📋</div>
                    <p>No ${label.toLowerCase()} found</p>
                    <button class="mt-4 px-4 py-2 rounded-lg text-white font-semibold create-btn"
                            style="background: linear-gradient(to right, #255F38, #1F7D53);"
                            data-entity="${section}">
                        + Create ${singular}
                    </button>
                </td>
            </tr>
        `;
    }

    // Render table rows with data
    renderTableRows(tbody, section, data) {
        const rowGenerators = {
            tables: (item) => this.generateTableRow(item),
            customers: (item) => this.generateCustomerRow(item),
            reservations: (item) => this.generateReservationRow(item),
            menu: (item) => this.generateMenuItemRow(item)
        };

        const generator = rowGenerators[section];
        if (!generator) return;

        tbody.innerHTML = data.map(item => generator(item)).join('');
    }

    // Generate table row with HTML
    generateTableRow(table) {
        return `
            <tr class="hover:bg-moss transition-colors" data-id="${table.id}">
                <td class="px-4 py-3 text-sm" style="color: #D1D5DB;">${table.id}</td>
                <td class="px-4 py-3 text-sm font-semibold text-emerald-600">${table.tableNumber}</td>
                <td class="px-4 py-3 text-sm" style="color: #D1D5DB;">${table.capacity} people</td>
                <td class="px-4 py-3 text-end">
                    ${this.generateActionButtons(table.id, 'tables')}
                </td>
            </tr>
        `;
    }

    // Generate customer row with HTML
    generateCustomerRow(customer) {
        return `
            <tr class="hover:bg-moss transition-colors" data-id="${customer.id}">
                <td class="px-4 py-3 text-sm" style="color: #D1D5DB;">${customer.id}</td>
                <td class="px-4 py-3 text-sm font-semibold text-emerald-600">${customer.name}</td>
                <td class="px-4 py-3 text-sm" style="color: #D1D5DB;">${customer.phoneNumber}</td>
                <td class="px-4 py-3 text-end">
                    ${this.generateActionButtons(customer.id, 'customers')}
                </td>
            </tr>
        `;
    }

    // Generate reservation row HTML
    generateReservationRow(reservation) {
        const date = new Date(reservation.startTime);
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

        return `
            <tr class="hover:bg-moss transition-colors" data-id="${reservation.id}">
                <td class="px-4 py-3 text-sm" style="color: #D1D5DB;">${reservation.id}</td>
                <td class="px-4 py-3 text-sm font-semibold text-emerald-600">${reservation.customer.name}</td>
                <td class="px-4 py-3 text-sm" style="color: #D1D5DB;">${formattedDate} at ${formattedTime}</td>
                <td class="px-4 py-3 text-sm" style="color: #D1D5DB;">${reservation.numberOfGuests} guests</td>
                <td class="px-4 py-3 text-sm" style="color: #D1D5DB;">Table ${reservation.cafeTable.tableNumber}</td>
                <td class="px-4 py-3 text-end">
                    ${this.generateActionButtons(reservation.id, 'reservations')}
                </td>
            </tr>
        `;
    }

    // Generate menu item row with HTML
    generateMenuItemRow(item) {
        return `
            <tr class="hover:bg-moss transition-colors" data-id="${item.id}">
                <td class="px-4 py-3 text-sm" style="color: #D1D5DB;">${item.id}</td>
                <td class="px-4 py-3 text-sm font-semibold text-emerald-600">${item.name}</td>
                <td class="px-4 py-3 text-sm text-emerald-600 font-semibold">$${item.price.toFixed(2)}</td>
                <td class="px-4 py-3 text-sm" style="color: #D1D5DB;">${item.description}</td>
                <td class="px-4 py-3 text-sm">
                    ${item.isPopular ? '<span class="text-emerald-600">✓ Popular</span>' : '<span class="text-gray-500">✗</span>'}
                </td>
                <td class="px-4 py-3 text-end">
                    ${this.generateActionButtons(item.id, 'menu')}
                </td>
            </tr>
        `;
    }

    // Generate action buttons with HTML
    generateActionButtons(id, entity) {
        return `
            <div class="flex gap-2 justify-end">
                <button class="edit-btn px-3 py-1 rounded text-sm transition-colors"
                        style="background-color: rgba(37, 95, 56, 0.5); color: #FFFFFF;"
                        data-id="${id}"
                        data-entity="${entity}"
                        title="Edit">
                    ✏️
                </button>
                <button class="delete-btn px-3 py-1 rounded text-sm transition-colors"
                        style="background-color: rgba(239, 68, 68, 0.3); color: #FCA5A5;"
                        data-id="${id}"
                        data-entity="${entity}"
                        title="Delete">
                    🗑️
                </button>
            </div>
        `;
    }

    //Handle create action
    handleCreate(entity) {
        modalHandler.open(entity, 'create');
    }

    // Handle edit action
    async handleEdit(entity, id) {
        const item = this.findItemById(entity, id);
        if (item) {
            modalHandler.open(entity, 'edit', item, id);
        }
    }

    // Handle delete action
    handleDelete(entity, id) {
        const item = this.findItemById(entity, id);
        if (item) {
            const itemName = item.name || item.tableNumber || item.id;
            modalHandler.openDeleteModal(entity, id, itemName);
        }
    }

    // Find item by ID in current section data
    findItemById(entity, id) {
        return this.data[entity]?.find(item => item.id === id);
    }

    // Refresh current section data
    async refreshCurrentSection() {
        const loaders = {
            tables: () => this.loadTables(),
            customers: () => this.loadCustomers(),
            reservations: () => this.loadReservations(),
            menu: () => this.loadMenuItems()
        };

        const loader = loaders[this.currentSection];
        if (loader) {
            await loader();
            this.renderSection(this.currentSection);
        }
    }
}

// Initialize dashboard when DOM is ready
let adminDashboard;
document.addEventListener('DOMContentLoaded', () => {
    adminDashboard = new AdminDashboard();
    window.adminDashboard = adminDashboard;
});