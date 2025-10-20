'use client';

import React, {
  forwardRef,
  MouseEventHandler,
  Ref,
  useEffect,
  useState
} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('profit-loss');
  const [periodDate, setPeriodDate] = useState<Date | null>(new Date());
  const [data, setData] = useState({
    income: 7500,
    expenses: 3000,
    profit: 4500,
    monthLabel: ''
  });

  useEffect(() => {
    fetchData();
  }, [periodDate]);

  function fetchData() {
    const pd = periodDate || new Date();
    const monthLabel = pd.toLocaleString('default', {
      month: 'long',
      year: 'numeric'
    });
    setData({
      income: 7500,
      expenses: 3000,
      profit: 4500,
      monthLabel
    });
  }

  const maxBar = Math.max(data.income, data.expenses, data.profit);

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    fetchData();
  }

  // This is called when user picks a month
  function handleChange(date: Date | null): void {
    setPeriodDate(date);
  }

  // Format function to “YYYY-MM”
  function formatYYYYMM(date: Date | null): string {
    if (!date) return '';
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${y}-${m}`;
  }

  return (
    <div className="min-h-screen flex text-xl flex-1 max-w-7xl">
      <main className="flex-1 p-6 ml-12">
        <header className="mb-12">
          <h1 className="mt-8 text-4xl font-semibold text-gray-800">
            Reports
          </h1>
        </header>

        <div className="ml-12">
          <section className="mb-10 font-semibold flex flex-col bg-white rounded-lg p-8 h-72 shadow-md shadow-gray-400 border border-gray-200">
            <h2 className="text-gray-700 mb-8">Generate Report</h2>
            <form onSubmit={handleGenerate} className="flex gap-8 ml-10 items-end">
              <div className="w-xs">
                <label className="block text-sm text-gray-600 mb-2">Type</label>
                <select
                  value={reportType}
                  onChange={e => setReportType(e.target.value)}
                  className="w-full border border-gray-600 rounded-xl px-4 py-5 bg-white text-sm text-gray-800"
                >
                  <option value="profit-loss">Profit & Loss</option>
                  <option value="balance-sheet">Balance Sheet</option>
                  <option value="cash-flow">Cash Flow</option>
                </select>
              </div>

              <div className="w-xs">
                <label className="block text-sm text-gray-600 mb-3">Time</label>
                <MonthYearPicker
                  value={periodDate}
                  onChange={handleChange}
                  placeholder="YYYY-MM"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white text-md cursor-pointer px-5 h-12 -translate-y-2 rounded-xl font-medium shadow-md shadow-gray-400 hover:bg-blue-700"
                >
                  Generate
                </button>
              </div>
            </form>
          </section>

          <section className="bg-white rounded-lg p-10 shadow-md shadow-gray-400 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-6">
              Monthly Profit &amp; Loss — {data.monthLabel}
            </h3>

            <div className="flex gap-8 items-end h-80 mb-6 mt-6 border-b border-gray-600">
              <Bar
                label="Total Income"
                value={data.income}
                color="bg-emerald-500"
                maxBar={maxBar}
              />
              <Bar
                label="Total Expenses"
                value={data.expenses}
                color="bg-red-500"
                maxBar={maxBar}
              />
              <Bar
                label="Net Profit"
                value={data.profit}
                color="bg-blue-500"
                maxBar={maxBar}
              />
            </div>

            <h4 className="font-semibold text-gray-700 mb-4 mt-32">
              Key Insights
            </h4>
            <ul className="text-md text-gray-600 space-y-2 ml-10">
              <li>• Your highest expense category this month was Rent ($1,200).</li>
              <li>• Your tax estimation is based on the 25% rate set in your profile.</li>
              <li>• Compliance Tip: Remember to categorize all receipts for Q4.</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}

function Bar({
  label,
  value,
  color,
  maxBar
}: {
  label: string;
  value: number;
  color: string;
  maxBar: number;
}) {
  const heightPct = Math.max(
    8,
    Math.min(100, Math.round((value / maxBar) * 100))
  );
  return (
    <div className="flex-1 text-center relative h-4/5">
      <div className="h-full flex items-center flex-col justify-end">
        <div className="text-2xl text-gray-700 mb-5 font-semibold">
          ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </div>
        <div
          className={`mx-auto w-40 rounded-t-xl ${color}`}
          style={{ height: `${heightPct}%`, minHeight: '16px' }}
        />
      </div>
      <div className="mt-2 text-md text-gray-500 absolute left-1/2 -translate-x-1/2">
        {label}
      </div>
    </div>
  );
}

const CustomInput = forwardRef(
  (
    {
      value,
      onClick,
      placeholder
    }: {
      value?: string;
      onClick?: MouseEventHandler<HTMLButtonElement>;
      placeholder?: string;
    },
    ref: Ref<HTMLButtonElement> | null
  ) => (
    <button
      type="button"
      ref={ref}
      onClick={onClick}
      className="w-80 border border-gray-600 rounded-xl px-4 py-5 bg-white text-sm text-gray-800 text-left"
    >
      {value || placeholder}
    </button>
  )
);

function MonthYearPicker({
  value,
  onChange,
  placeholder = 'Select month'
}: {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
}) {
  return (
    <DatePicker
        selected={value}
        onChange={date => {
            onChange(date);
        }}
        dateFormat="yyyy-MM"
        showMonthYearPicker
        customInput={<CustomInput placeholder={placeholder} />}
    />
  );
}
