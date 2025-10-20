import React from "react";

const UserPage: React.FC = () => {
  return (
    <main className="w-full flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 mt-12 md:mt-8 text-black">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 self-start">My Account & Settings</h1>
      <section className="w-full max-w-4xl bg-white rounded-xl shadow-md p-4 sm:p-8 mb-8">
        <form className="space-y-8">
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Business Profile</h2>
            <div className="mb-4">
              <label htmlFor="businessName" className="block text-sm font-medium mb-1 text-gray-700">Business Name</label>
              <input
                id="businessName"
                type="text"
                placeholder="Name..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="contactEmail" className="block text-sm font-medium mb-1 text-gray-700">Contact Email</label>
              <input
                id="contactEmail"
                type="email"
                placeholder="Email..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>
            <div className="mb-2">
              <label htmlFor="taxRate" className="block text-sm font-medium mb-1 text-gray-700">Estimated Annual Tax Rate (%)</label>
              <input
                id="taxRate"
                type="number"
                placeholder="0%"
                className="w-24 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                This is used to improve your tax estimation reports
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Security</h2>
            <button
              type="button"
              className="border border-red-300 text-red-500 px-4 py-2 rounded hover:bg-red-50 transition mb-4"
            >
              Change Password
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold"
          >
            Save Changes
          </button>
        </form>
      </section>
    </main>
  );
};

export default UserPage;
