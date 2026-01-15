// src/layout/Header.js
import { Search, Bell, User } from "lucide-react";

export function Header() {
  return (
    <header className="h-20 bg-white border-b border-green-200 shadow-md">
      <div className="h-full px-8 flex items-center justify-between">
        
        {/* Search */}
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
            <input
              type="text"
              placeholder="Search riders, bikes, assignments..."
              className="w-full pl-12 pr-4 py-2.5 bg-green-50 border border-green-200 rounded-xl
                         placeholder:text-green-400 text-green-800
                         focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
            />
          </div>
        </div>

        {/* Notifications + User */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2.5 bg-green-50 rounded-xl hover:bg-green-100 transition-all border border-green-200">
            <Bell className="w-5 h-5 text-green-600" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* User */}
          <div className="flex items-center gap-3 pl-4 border-l border-green-200">
            <div className="text-right">
              <p className="text-green-700 font-medium">Admin User</p>
              <p className="text-green-500 text-sm">Administrator</p>
            </div>

            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center border border-green-300">
              <User className="w-5 h-5 text-green-700" />
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}

export default Header;
