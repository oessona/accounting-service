import { useState } from "react";
import { User, Settings, LogOut, HelpCircle, Sun } from "lucide-react";

export default function AccountMenu() {
  const [open, setOpen] = useState(false);

  const user = {
    name: "Name",
    role: "Admin"
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full"
      >
        <User className="w-5 h-5 text-gray-700" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-xl border border-gray-200 p-3 z-50">
          <div className="px-3 py-2 border-b border-gray-100 mb-2">
            <p className="text-sm text-gray-500">Signed in as</p>
            <p className="font-semibold text-gray-900">{user.role}</p>
          </div>

          <ul className="space-y-1">
            <li>
              <button className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-800">
                <Settings className="w-4 h-4 text-gray-500" />
                Settings
              </button>
            </li>
            <li>
              <button className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-800">
                <HelpCircle className="w-4 h-4 text-gray-500" />
                Help
              </button>
            </li>
            <li>
              <button className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-800">
                <Sun className="w-4 h-4 text-gray-500" />
                Toggle Theme
              </button>
            </li>
            <li>
              <button className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-red-600">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
