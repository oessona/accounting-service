// Wait for the entire HTML document to be loaded and parsed
document.addEventListener("DOMContentLoaded", () => {
    const currentPath = window.location.pathname;

    // Select all navigation links
    const navLinks = document.querySelectorAll(".sidebar-nav .nav-link");

    // Loop through each link to check if it matches the current path
    navLinks.forEach((link) => {
        // Get the href attribute from the link
        const linkPath = link.getAttribute("href");

        // Check if the link's path matches the current page's path
        if (linkPath === currentPath) {
            link.classList.add("active");
        }
    });

    // --- 1. ELEMENT SELECTORS ---
    // Get references to all the interactive elements on the page.
    const netIncomeEl = document.querySelector(
        ".dashboard__income .dashboard__card-price"
    );
    const totalExpensesEl = document.querySelector(
        ".dashboard__expenses .dashboard__card-price"
    );
    const estimatedTaxEl = document.querySelector(
        ".dashboard__taxes .dashboard__card-price"
    );
    const welcomeMessageEl = document.querySelector(".dashboard__welcoming");

    const transactionForm = document.getElementById("transaction-form");
    const amountInput = document.getElementById("transaction-amount");
    const typeInput = document.getElementById("transaction-type");
    const descriptionInput = document.getElementById("transaction-description");
    const saveButton = document.getElementById("save-transaction-btn");
    const feedbackMessageEl = document.getElementById("feedback-message");

    // --- 2. API FUNCTIONS (WITH BACKEND COMMENTS) ---
    // These functions simulate talking to a server. Your friend will replace these
    // with actual 'fetch' calls in React.

    /**
     * BACKEND NOTE: Fetch dashboard summary data.
     * - Endpoint: GET /api/dashboard-summary
     * - Auth: Requires authentication token.
     * - Success Response (200 OK):
     * {
     * "userName": "Nuryk",
     * "netIncome": 4820.00,
     * "totalExpenses": 1500.00,
     * "estimatedTax": 820.00
     * }
     */
    async function fetchDashboardData() {
        console.log("Fetching dashboard data from server...");
        // Simulate a network delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // This is placeholder data. The backend will provide real data.
        const mockData = {
            userName: " Small Business Owner!", // Fetched from the authenticated user's details
            netIncome: 4820.55,
            totalExpenses: 1500.25,
            estimatedTax: 820.1,
        };

        console.log("Data received:", mockData);
        return mockData;
    }

    /**
     * BACKEND NOTE: Save a new transaction.
     * - Endpoint: POST /api/transactions
     * - Auth: Requires authentication token.
     * - Request Body:
     * {
     * "type": "income" | "expense",
     * "amount": 150.75,
     * "description": "Client payment"
     * }
     * - Success Response (201 Created):
     * { "message": "Transaction saved successfully!" }
     * - Error Response (422 Unprocessable Entity or 400 Bad Request):
     * { "message": "Invalid input provided.", "errors": { "amount": ["Amount must be positive."] } }
     */
    async function saveTransaction(transactionData) {
        console.log("Saving transaction to server...", transactionData);
        saveButton.textContent = "Saving...";
        saveButton.disabled = true;

        // Simulate a network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Simulate a successful response from the backend
        if (transactionData.amount > 0) {
            console.log("Server responded with success.");
            return { success: true, message: "Transaction saved successfully!" };
        } else {
            // Simulate an error response from the backend
            console.log("Server responded with an error.");
            throw new Error("Server error: Amount must be a positive number.");
        }
    }

    // --- 3. UI UPDATE FUNCTIONS ---

    // A helper to format numbers as currency (e.g., 4820.55 -> $4,820.55)
    function formatCurrency(amount) {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    }

    // Updates the three main cards with new data.
    function updateDashboardCards(data) {
        welcomeMessageEl.textContent = `Welcome back, ${data.userName}!`;
        netIncomeEl.textContent = formatCurrency(data.netIncome);
        totalExpensesEl.textContent = formatCurrency(data.totalExpenses);
        estimatedTaxEl.textContent = formatCurrency(data.estimatedTax);
    }

    // Shows a success or error message to the user for a few seconds.
    function showFeedbackMessage(message, type) {
        feedbackMessageEl.textContent = message;
        feedbackMessageEl.className = "feedback"; // Reset classes
        feedbackMessageEl.classList.add(`feedback--${type}`, "show");

        // Hide the message after 3 seconds
        setTimeout(() => {
            feedbackMessageEl.classList.remove("show");
        }, 3000);
    }

    // --- 4. EVENT LISTENERS ---

    // Handle the form submission for a new transaction.
    transactionForm.addEventListener("submit", async (event) => {
        // Prevent the default browser behavior of reloading the page
        event.preventDefault();

        // Clear any previous feedback messages
        feedbackMessageEl.classList.remove("show");

        // a. Basic Frontend Validation
        const amount = parseFloat(amountInput.value);
        const type = typeInput.value;
        const description = descriptionInput.value.trim();

        if (isNaN(amount) || amount <= 0) {
            showFeedbackMessage("Please enter a valid, positive amount.", "error");
            return;
        }
        if (!type || type === "select") {
            showFeedbackMessage("Please select a transaction type.", "error");
            return;
        }
        if (description === "") {
            showFeedbackMessage("Please enter a description.", "error");
            return;
        }

        const transactionData = { amount, type, description };

        // b. Handle API Call and Feedback
        try {
            const response = await saveTransaction(transactionData);

            if (response.success) {
                showFeedbackMessage(response.message, "success");
                transactionForm.reset(); // Clear the form fields
                typeInput.value = ""; // Reset select dropdown properly

                // After a successful transaction, refresh the dashboard data
                initializeDashboard();
            }
        } catch (error) {
            // Show the error message from the simulated server response
            showFeedbackMessage(error.message, "error");
        } finally {
            // This runs whether the request succeeded or failed
            saveButton.textContent = "Save Transaction";
            saveButton.disabled = false;
        }
    });

    // --- 5. INITIALIZATION ---

    // This function runs when the page first loads.
    async function initializeDashboard() {
        try {
            // Fetch the initial data and update the UI
            const initialData = await fetchDashboardData();
            updateDashboardCards(initialData);
        } catch (error) {
            // In a real app, you might show a big error message if the initial data fails to load
            console.error("Failed to initialize dashboard:", error);
            welcomeMessageEl.textContent = "Could not load data. Please refresh.";
        }
    }

    // Start the application!
    initializeDashboard();
});
