import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="max-w-5xl w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Management System</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/dashboard" 
                className="block p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Dashboard</h2>
            <p className="text-gray-600">View key metrics and analytics</p>
          </Link>

          <Link href="/transactions"
                className="block p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Transactions</h2>
            <p className="text-gray-600">Manage stock movements</p>
          </Link>

          <Link href="/reports"
                className="block p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Reports</h2>
            <p className="text-gray-600">Generate and view reports</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
