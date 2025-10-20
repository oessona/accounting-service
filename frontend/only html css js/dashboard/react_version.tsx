'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar'; // Your existing Sidebar component

// This is the main Dashboard Page component
export default function DashboardPage() {
  const router = useRouter();

  // --- 1. STATE MANAGEMENT (The React way) ---
  // We use 'useState' to store data that can change and re-render the UI.
  const [dashboardData, setDashboardData] = useState({
    userName: 'User',
    netIncome: 0,
    totalExpenses: 0,
    estimatedTax: 0,
  });
  const [isLoading, setIsLoading] = useState(true); // For loading initial data
  const [isSubmitting, setIsSubmitting] = useState(false); // For form submission

  // State for the transaction form inputs
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  
  // State for feedback messages
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  // --- 2. DATA FETCHING & AUTHENTICATION ---
  // We use 'useEffect' to run code when the component first loads.
  useEffect(() => {
    // Check if user is logged in. If not, redirect to login page.
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
      return; // Stop further execution
    }
    
    // --- BACKEND NOTE FOR YOUR FRIEND ---
    // This is where you'll make the real API call to get dashboard data.
    // The vanilla JS comments are still valid here.
    // - Endpoint: GET /api/dashboard-summary
    // - Auth: Send the 'token' from localStorage in the Authorization header.
    //   e.g., headers: { 'Authorization': `Bearer ${token}` }
    async function fetchDashboardData() {
      console.log("Fetching dashboard data from server...");
      setIsLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // This is placeholder data. Replace with the actual fetch call.
      const mockData = {
        userName: "Nuryk",
        netIncome: 4820.55,
        totalExpenses: 1500.25,
        estimatedTax: 820.10,
      };
      
      setDashboardData(mockData); // Update the state with fetched data
      setIsLoading(false);
      console.log("Data received and component updated.");
    }

    fetchDashboardData();
  }, [router]); // The empty array means this effect runs only once when the component mounts.


  // --- 3. FORM SUBMISSION HANDLER ---

  const handleTransactionSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent page reload
    
    // --- BACKEND NOTE FOR YOUR FRIEND ---
    // This function handles saving a new transaction.
    // The vanilla JS comments are still valid here.
    // - Endpoint: POST /api/transactions
    // - Auth: Requires authentication token.
    // - Request Body: { type, amount, description }
    
    // a. Frontend Validation
    if (!amount || parseFloat(amount) <= 0) {
      showFeedback('Please enter a valid, positive amount.', 'error');
      return;
    }
    if (!type) {
      showFeedback('Please select a transaction type.', 'error');
      return;
    }
    if (!description.trim()) {
      showFeedback('Please enter a description.', 'error');
      return;
    }

    setIsSubmitting(true);
    
    // b. Simulate API Call
    try {
      console.log("Saving transaction to server...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // This is where the real 'fetch' call will go.
      // For now, we just simulate success.
      console.log("Server responded with success.");
      showFeedback('Transaction saved successfully!', 'success');
      
      // Clear the form
      setAmount('');
      setType('');
      setDescription('');

      // Here you would re-fetch the dashboard data to show updated totals
      // For the demo, we won't re-fetch. In a real app, you'd call fetchDashboardData() again.

    } catch (error) {
      console.error("Failed to save transaction:", error);
      showFeedback('Failed to save transaction. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 4. UTILITY FUNCTIONS ---

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const showFeedback = (message: string, type: 'success' | 'error') => {
    setFeedback({ message, type });
    setTimeout(() => {
      setFeedback({ message: '', type: '' });
    }, 3000);
  };
  
  // If the page is loading the initial data or redirecting, show a loading message.
  if (isLoading) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f7f7fa' }}>
            <p>Loading Dashboard...</p>
        </div>
    );
  }

  // --- 5. JSX (The HTML structure) ---
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main className="main">
        <div className="titles">
          <h1 className="dashboard__title">Dashboard</h1>
          <p className="dashboard__welcoming">
            Welcome back, {dashboardData.userName}!
          </p>
          <h3>Financial Snapshot</h3>
        </div>
        <section className="dashboard__container">
          <div className="card__container">
            <div className="dashboard__card dashboard__income">
              <p className="dashboard__card-title">Net Income (This Month)</p>
              <h2 className="dashboard__card-price">
                {formatCurrency(dashboardData.netIncome)}
              </h2>
              <p className="dashboard__card-percent dashboard__income-percent">
                ↑ +5% from last month
              </p>
            </div>
            <div className="dashboard__card dashboard__expenses">
              <p className="dashboard__card-title">Total Expenses (This Month)</p>
              <h2 className="dashboard__card-price">
                {formatCurrency(dashboardData.totalExpenses)}
              </h2>
              <p className="dashboard__card-percent dashboard__expenses-percent">
                ↓ 1.2% from last month
              </p>
            </div>
            <div className="dashboard__card dashboard__taxes">
              <p className="dashboard__card-title">Estimated Tax (This Month)</p>
              <h2 className="dashboard__card-price">
                {formatCurrency(dashboardData.estimatedTax)}
              </h2>
              <p className="dashboard__card-percent dashboard__taxes-percent">
                Based on 25% rate
              </p>
            </div>
          </div>

          <div className="transaction-card">
            <h3 className="transaction__title">Record New Transaction</h3>
            <form id="transaction-form" onSubmit={handleTransactionSubmit}>
              <div className="transaction__inputs">
                <div className="input__group">
                  <label htmlFor="transaction-amount">Amount ($)</label>
                  <input
                    type="number"
                    id="transaction-amount"
                    placeholder="0.00"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="input__group">
                  <label htmlFor="transaction-type">Type</label>
                  <select
                    id="transaction-type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select type...</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div className="input__group">
                  <label htmlFor="transaction-description">Description / Vendor</label>
                  <input
                    type="text"
                    id="transaction-description"
                    placeholder="e.g., Office Supplies"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              {feedback.message && (
                <div 
                  id="feedback-message" 
                  className={`feedback show feedback--${feedback.type}`}
                >
                  {feedback.message}
                </div>
              )}

              <button
                id="save-transaction-btn"
                className="btn btn--primary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Transaction'}
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* --- 6. STYLES --- */}
      {/* All your CSS is placed here directly using styled-jsx. */}
      {/* This keeps the component self-contained and doesn't affect other pages. */}
      <style jsx global>{`
        /* Basic Reset and Body Style */
        .main {
          display: flex;
          flex-direction: column;
          padding: 48px;
          width: 100%; /* Make main content take remaining space */
        }
        .titles {
          margin-bottom: 40px;
        }
        .dashboard__title {
          font-family: "Inter", system-ui, sans-serif;
          font-size: 32px;
          font-weight: 700;
          line-height: 40px;
          margin-bottom: 10px;
        }
        .dashboard__welcoming {
          color: #6b7280;
          font-size: 18px;
          line-height: 24px;
          margin-bottom: 20px;
        }
        .dashboard__container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 36px;
        }
        .card__container {
          display: flex;
          width: 100%;
          gap: 24px;
        }
        .dashboard__card {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 32px;
          gap: 24px;
          min-width: 250px;
          min-height: 200px;
          background-color: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        .dashboard__card-title {
          line-height: 20px;
          font-weight: 500;
          font-size: 14px;
        }
        .dashboard__card-price {
          font-weight: 700;
          font-size: 24px;
          line-height: 32px;
        }
        .dashboard__card-percent {
          font-weight: 500;
          font-size: 14px;
          line-height: 20px;
        }
        .dashboard__income-percent {
          color: #10b981;
        }
        .dashboard__expenses-percent {
          color: #ef4444;
        }
        .dashboard__taxes-percent {
          color: #3b82f6;
        }
        .transaction-card {
          background-color: #ffffff;
          padding: 32px;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          width: 100%;
        }
        #transaction-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
          position: relative;
        }
        .transaction__title {
          font-size: 18px;
          font-weight: 600;
          margin-top: 0;
          margin-bottom: 24px;
        }
        .transaction__inputs {
          display: flex;
          gap: 24px;
        }
        .input__group {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .input__group label {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 8px;
        }
        .input__group input,
        .input__group select {
          height: 50px;
          border: 1px solid #d1d5db;
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 16px;
          width: 100%;
          box-sizing: border-box;
        }
        .input__group input::placeholder {
          color: #9ca3af;
        }
        .input__group select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M6.175 7.15002L10 10.975L13.825 7.15002L15 8.33336L10 13.3334L5 8.33336L6.175 7.15002Z' fill='%236B7280'/%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1.25em;
        }
        .feedback {
          width: 100%;
          padding: 12px;
          margin-bottom: 16px;
          border-radius: 8px;
          font-weight: 500;
          text-align: center;
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
          height: 0;
          overflow: hidden;
        }
        .feedback.show {
          opacity: 1;
          height: auto;
        }
        .feedback--success {
          background-color: #d1fae5;
          color: #065f46;
        }
        .feedback--error {
          background-color: #fee2e2;
          color: #991b1b;
        }
        .btn {
          background-color: #10b981;
          border: 1px solid transparent;
          border-radius: 12px;
          padding: 12px 16px;
          color: white;
          cursor: pointer;
          font-family: "Inter", sans-serif;
          font-size: 18px;
          font-weight: 600;
          line-height: 24px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: background-color 0.2s, box-shadow 0.2s, border-color 0.2s;
          max-width: 170px;
        }
        .btn:disabled {
          background-color: #6b7280;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}