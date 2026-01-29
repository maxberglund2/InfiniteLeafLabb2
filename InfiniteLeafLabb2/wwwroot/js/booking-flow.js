class BookingFlow {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 5;
        this.bookingData = {
            date: null,
            time: null,
            guests: null,
            tableId: null,
            tableName: null,
            customerName: null,
            customerPhone: null,
            specialRequests: null
        };

        this.initialize();
    }

    initialize() {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('booking-date').setAttribute('min', today);

        // Party size button handlers
        document.querySelectorAll('.party-size-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.party-size-btn').forEach(b => b.classList.remove('selected'));
                e.currentTarget.classList.add('selected');
                this.bookingData.guests = parseInt(e.currentTarget.dataset.size);
            });
        });

        // Input validation
        this.setupInputValidation();
    }

    setupInputValidation() {
        const nameInput = document.getElementById('customer-name');
        const phoneInput = document.getElementById('customer-phone');

        if (nameInput) {
            nameInput.addEventListener('input', (e) => {
                this.bookingData.customerName = e.target.value;
            });
        }

        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                this.bookingData.customerPhone = e.target.value;
            });
        }
    }

    validateStep(step) {
        switch (step) {
            case 1:
                const dateField = document.getElementById('booking-date');
                const timeField = document.getElementById('booking-time');

                if (!dateField || !timeField) {
                    this.showError('Form fields not found');
                    return false;
                }

                const date = dateField.value;
                const time = timeField.value;

                if (!date || !time) {
                    this.showError('Please select both date and time');
                    return false;
                }

                this.bookingData.date = date;
                this.bookingData.time = time;
                return true;

            case 2:
                if (!this.bookingData.guests) {
                    this.showError('Please select the number of guests');
                    return false;
                }
                return true;

            case 3:
                if (!this.bookingData.tableId) {
                    this.showError('Please select a table');
                    return false;
                }
                return true;

            case 4:
                const nameField = document.getElementById('customer-name');
                const phoneField = document.getElementById('customer-phone');

                if (!nameField || !phoneField) {
                    this.showError('Form fields not found');
                    return false;
                }

                const name = nameField.value.trim();
                const phone = phoneField.value.trim();

                if (!name || name.length < 2) {
                    this.showError('Please enter your full name');
                    return false;
                }

                if (!phone || phone.length < 10) {
                    this.showError('Please enter a valid phone number');
                    return false;
                }

                this.bookingData.customerName = name;
                this.bookingData.customerPhone = phone;

                const specialRequestsField = document.getElementById('special-requests');
                this.bookingData.specialRequests = specialRequestsField ? specialRequestsField.value.trim() : '';
                return true;

            case 5:
                return true;

            default:
                return true;
        }
    }

    async nextStep() {
        if (!this.validateStep(this.currentStep)) {
            return;
        }

        // Special handling for step 2 -> 3 (load available tables)
        if (this.currentStep === 2) {
            await this.loadAvailableTables();
        }

        // Special handling for step 4 -> 5 (show confirmation)
        if (this.currentStep === 4) {
            this.showConfirmation();
        }

        this.currentStep++;
        this.updateUI();
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateUI();
        }
    }

    goToStep(step) {
        if (step >= 1 && step <= this.totalSteps) {
            this.currentStep = step;
            this.updateUI();
        }
    }

    updateUI() {
        // Hide all steps
        document.querySelectorAll('.booking-step').forEach(step => {
            step.classList.add('hidden');
            step.classList.remove('active');
        });

        // Show current step
        const currentStepElement = document.getElementById(`step-${this.currentStep}`);
        if (currentStepElement) {
            currentStepElement.classList.remove('hidden');
            currentStepElement.classList.add('active');
        }

        // Update progress indicators
        document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
            const stepNumber = index + 1;
            indicator.classList.remove('active', 'completed');

            if (stepNumber < this.currentStep) {
                indicator.classList.add('completed');
            } else if (stepNumber === this.currentStep) {
                indicator.classList.add('active');
            }
        });

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async loadAvailableTables() {
        const tablesLoading = document.getElementById('tables-loading');
        const availableTables = document.getElementById('available-tables');
        const noTables = document.getElementById('no-tables');
        const tablesGrid = document.getElementById('tables-grid');

        // Show loading state
        tablesLoading.classList.remove('hidden');
        availableTables.classList.add('hidden');
        noTables.classList.add('hidden');

        try {
            // Combine date and time to create DateTime
            const dateTime = `${this.bookingData.date}T${this.bookingData.time}:00`;
            const startTime = new Date(dateTime);

            // Format for URL - using ISO string
            const formattedDateTime = startTime.toISOString();

            // Fetch available tables from the PUBLIC endpoint (no auth required)
            const response = await fetch(
                `/Tables/GetAvailable?startTime=${encodeURIComponent(formattedDateTime)}&numberOfGuests=${this.bookingData.guests}`
            );

            // Hide loading
            tablesLoading.classList.add('hidden');

            if (!response.ok) {
                throw new Error('Failed to fetch available tables');
            }

            const suitableTables = await response.json();

            if (!Array.isArray(suitableTables) || suitableTables.length === 0) {
                noTables.classList.remove('hidden');
                return;
            }

            // Show tables
            availableTables.classList.remove('hidden');

            // Render table cards
            tablesGrid.innerHTML = suitableTables.map(table => `
                <div class="table-card" data-table-id="${table.id}" data-table-number="${table.tableNumber}">
                    <div class="text-5xl mb-3">🪑</div>
                    <div class="text-2xl font-bold text-emerald-400 mb-2">
                        Table ${table.tableNumber}
                    </div>
                    <div class="text-gray-400 text-sm mb-3">
                        Capacity: ${table.capacity} ${table.capacity === 1 ? 'person' : 'people'}
                    </div>
                    <div class="text-emerald-500 text-sm font-semibold">
                        ✓ Available
                    </div>
                </div>
            `).join('');

            // Add click handlers to table cards
            document.querySelectorAll('.table-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    document.querySelectorAll('.table-card').forEach(c => c.classList.remove('selected'));
                    e.currentTarget.classList.add('selected');
                    this.bookingData.tableId = parseInt(e.currentTarget.dataset.tableId);
                    this.bookingData.tableName = `Table ${e.currentTarget.dataset.tableNumber}`;
                });
            });

        } catch (error) {
            console.error('Error loading tables:', error);
            tablesLoading.classList.add('hidden');
            this.showError('Failed to load available tables. Please try again.');
        }
    }

    showConfirmation() {
        // Format date and time for display
        const date = new Date(this.bookingData.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const time = this.bookingData.time;
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        const formattedTime = `${displayHour}:${minutes} ${ampm}`;

        // Update confirmation fields
        document.getElementById('confirm-datetime').textContent = `${formattedDate} at ${formattedTime}`;
        document.getElementById('confirm-guests').textContent = `${this.bookingData.guests} ${this.bookingData.guests === 1 ? 'Guest' : 'Guests'}`;
        document.getElementById('confirm-table').textContent = this.bookingData.tableName;
        document.getElementById('confirm-name').textContent = this.bookingData.customerName;
        document.getElementById('confirm-phone').textContent = this.bookingData.customerPhone;

        // Handle special requests
        if (this.bookingData.specialRequests) {
            document.getElementById('confirm-requests-section').classList.remove('hidden');
            document.getElementById('confirm-requests').textContent = this.bookingData.specialRequests;
        } else {
            document.getElementById('confirm-requests-section').classList.add('hidden');
        }
    }

    async confirmBooking() {
        const confirmBtn = document.getElementById('confirm-booking-btn');
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<span class="spinner" style="width: 24px; height: 24px; display: inline-block; margin-right: 8px;"></span> Processing...';

        try {
            // First, create or get customer (using direct fetch since apiClient might require auth)
            const customerResponse = await fetch('/Customers/Create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: this.bookingData.customerName,
                    phoneNumber: this.bookingData.customerPhone
                })
            });

            if (!customerResponse.ok) {
                throw new Error('Failed to create customer');
            }

            const customer = await customerResponse.json();

            // Create reservation
            const dateTime = `${this.bookingData.date}T${this.bookingData.time}:00`;

            const reservationResponse = await fetch('/Reservations/Create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    startTime: dateTime,
                    numberOfGuests: this.bookingData.guests,
                    cafeTableId: this.bookingData.tableId,
                    customerId: customer.id
                })
            });

            if (!reservationResponse.ok) {
                throw new Error('Failed to create reservation');
            }

            const reservation = await reservationResponse.json();

            // Show success
            this.showSuccess(reservation);

        } catch (error) {
            console.error('Error confirming booking:', error);
            this.showError('Failed to confirm booking. Please try again.');
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = 'Confirm Reservation ✓';
        }
    }

    showSuccess(reservation) {
        // Hide confirmation step
        document.getElementById('step-5').classList.add('hidden');

        // Show success step
        const successStep = document.getElementById('step-success');
        successStep.classList.remove('hidden');

        // Format date and time for display
        const date = new Date(this.bookingData.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const time = this.bookingData.time;
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        const formattedTime = `${displayHour}:${minutes} ${ampm}`;

        // Populate success details
        document.getElementById('success-details').innerHTML = `
            <div class="flex justify-between">
                <span class="text-emerald-500 font-semibold">Confirmation:</span>
                <span class="font-bold">#${reservation.id}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-emerald-500 font-semibold">Date & Time:</span>
                <span>${formattedDate} at ${formattedTime}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-emerald-500 font-semibold">Table:</span>
                <span>${this.bookingData.tableName}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-emerald-500 font-semibold">Guests:</span>
                <span>${this.bookingData.guests} ${this.bookingData.guests === 1 ? 'person' : 'people'}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-emerald-500 font-semibold">Name:</span>
                <span>${this.bookingData.customerName}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-emerald-500 font-semibold">Phone:</span>
                <span>${this.bookingData.customerPhone}</span>
            </div>
        `;

        // Update progress to show all steps completed
        document.querySelectorAll('.step-indicator').forEach(indicator => {
            indicator.classList.remove('active');
            indicator.classList.add('completed');
        });

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    showError(message) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'error-toast';
        toast.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="text-2xl">⚠️</span>
                <span class="flex-1">${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="text-white hover:text-gray-300">✕</button>
            </div>
        `;

        // Add styles if not already present
        if (!document.getElementById('toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                .error-toast {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(to right, rgba(220, 38, 38, 0.95), rgba(185, 28, 28, 0.95));
                    color: white;
                    padding: 16px 20px;
                    border-radius: 12px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
                    z-index: 9999;
                    animation: slideInRight 0.3s ease-out;
                    max-width: 400px;
                    border: 1px solid rgba(239, 68, 68, 0.5);
                    backdrop-filter: blur(10px);
                }
                
                @keyframes slideInRight {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                .error-toast button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 18px;
                    padding: 0;
                    margin: 0;
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            toast.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }
}

// Initialize booking flow when DOM is ready
let bookingFlow;
document.addEventListener('DOMContentLoaded', () => {
    bookingFlow = new BookingFlow();
});