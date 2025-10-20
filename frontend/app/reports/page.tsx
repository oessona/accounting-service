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
    <div className="min-h-screen flex text-base md:text-xl flex-1 max-w-7xl w-full py-10 md:py-0">
      <main className="flex-1 p-4 md:p-6 md:ml-12">
        <header className="mb-8 md:mb-12">
          <h1 className="mt-4 md:mt-8 text-3xl md:text-4xl font-semibold text-gray-800">
            Reports
          </h1>
        </header>

        <div className="md:ml-12">
          <section className="mb-6 md:mb-10 font-semibold flex flex-col bg-white rounded-lg p-4 md:p-8 min-h-[18rem] shadow-md shadow-gray-400 border border-gray-200">
            <h2 className="text-gray-700 mb-6 md:mb-8">Generate Report</h2>
            <form onSubmit={handleGenerate} className="flex flex-col md:flex-row md:flex-wrap gap-4 items-start md:items-end">
              <div className="w-full lg:max-w-xs">
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

              <div className="lg:w-xs">
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

          <section className="bg-white rounded-lg p-4 md:p-10 shadow-md shadow-gray-400 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4 md:mb-6 text-lg md:text-xl">
              Monthly Profit &amp; Loss — {data.monthLabel}
            </h3>

            <div className="relative w-full flex gap-8 md:gap-8 items-center justify-center md:items-end h-auto md:h-[400px] mb-4 mt-4">
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

            <div className="w-full border-t border-gray-200 md:border-gray-600 -mt-4 mb-8"></div>
            <h4 className="font-semibold text-gray-700 mb-3 md:mb-4 text-lg md:text-xl">
              Key Insights
            </h4>
            <ul className="text-sm md:text-md text-gray-600 space-y-2 ml-4 md:ml-10">
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
    <div className="md:flex-1 w-20 text-center relative h-[200px] md:h-full">
      <div className="h-full flex flex-col justify-end">
        <div className="text-xl md:text-2xl text-gray-700 mb-3 font-semibold">
          ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </div>
        <div
          className={`mx-auto w-full md:w-40 rounded-t-xl transition-all duration-300 ${color}`}
          style={{ height: `${heightPct}%`, minHeight: '24px' }}
        />
      </div>
      <div className="mt-3 text-sm md:text-md text-gray-500">
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
      className="w-full !w-80 border border-gray-600 rounded-xl px-4 py-5 bg-white text-sm text-gray-800 text-left"
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
        className="flex-1 w-full"
        dateFormat="yyyy-MM"
        showMonthYearPicker
        customInput={<CustomInput placeholder={placeholder} />}
    />
  );
}
