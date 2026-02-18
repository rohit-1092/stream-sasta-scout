import React, { useState } from 'react';
import { Search, Home, Tv, Film, X, LogOut } from 'lucide-react';

const Navbar = ({ onSearch, onLogout }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleInput = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <>
      {/* PC SIDEBAR - Hidden on Mobile */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-20 flex-col items-center bg-[#0f1014] py-8 border-r border-gray-800 z-50 hover:w-64 transition-all group overflow-hidden">
        <div className="mb-10 text-[#38bdf8] font-bold text-2xl">ARK</div>
        <div className="flex flex-col gap-10 text-gray-400 w-full">
          <div className="flex items-center gap-6 hover:text-white cursor-pointer px-6"><Home size={24} /><span className="hidden group-hover:block font-medium">Home</span></div>
          <div className="flex items-center gap-6 hover:text-white cursor-pointer px-6"><Tv size={24} /><span className="hidden group-hover:block font-medium">TV</span></div>
          <div className="flex items-center gap-6 hover:text-white cursor-pointer px-6"><Film size={24} /><span className="hidden group-hover:block font-medium">Movies</span></div>
        </div>
        <div onClick={onLogout} className="mt-auto flex items-center gap-6 hover:text-red-500 cursor-pointer px-6 w-full"><LogOut size={24} /><span className="hidden group-hover:block font-medium">Logout</span></div>
      </nav>

      {/* TOP BAR - Search & Mobile Logo */}
      <div className={`fixed top-0 left-0 w-full p-4 flex justify-between items-center z-40 md:pl-24 ${isSearchOpen ? 'bg-[#0f1014]' : 'bg-transparent'}`}>
        <div className="md:hidden text-[#38bdf8] font-bold text-xl">ARK</div>
        <div className="flex items-center gap-4 ml-auto">
          {isSearchOpen ? (
            <div className="flex items-center bg-gray-800/90 rounded-lg px-3 py-1.5 w-[70vw] md:w-80 border border-gray-700">
              <Search size={18} className="text-gray-400" />
              <input autoFocus className="bg-transparent border-none outline-none text-white px-2 w-full text-sm" placeholder="Search..." value={query} onChange={handleInput} />
              <X size={18} className="text-gray-400 cursor-pointer" onClick={() => {setIsSearchOpen(false); onSearch(""); setQuery("");}} />
            </div>
          ) : (
            <div className="p-2 bg-gray-800/40 rounded-full cursor-pointer" onClick={() => setIsSearchOpen(true)}><Search size={20} className="text-white" /></div>
          )}
        </div>
      </div>

      {/* MOBILE BOTTOM NAV - Hidden on PC */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-[#0f1014] flex justify-around items-center border-t border-gray-800 z-50">
        <Home className="text-gray-400 hover:text-[#38bdf8]" size={24} />
        <Tv className="text-gray-400 hover:text-[#38bdf8]" size={24} />
        <Film className="text-gray-400 hover:text-[#38bdf8]" size={24} />
        <LogOut onClick={onLogout} className="text-gray-400 hover:text-red-500" size={24} />
      </nav>
    </>
  );
};

export default Navbar;