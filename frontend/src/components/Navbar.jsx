import React, { useState } from 'react';
import { Search, Home, Tv, Film, X, Play } from 'lucide-react';

const Navbar = ({ onSearch }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleInput = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value); 
  };

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-20 flex-col items-center bg-[#0f1014] py-8 border-r border-gray-800 z-50 hover:w-64 transition-all group overflow-hidden">
        <div className="mb-10 text-blue-500 font-bold text-2xl">ARK</div>
        <div className="flex flex-col gap-10 text-gray-400">
          <div className="flex items-center gap-6 hover:text-white cursor-pointer px-4">
            <Home size={28} /> <span className="hidden group-hover:block font-medium">Home</span>
          </div>
          <div className="flex items-center gap-6 hover:text-white cursor-pointer px-4">
            <Tv size={28} /> <span className="hidden group-hover:block font-medium">TV</span>
          </div>
          <div className="flex items-center gap-6 hover:text-white cursor-pointer px-4">
            <Film size={28} /> <span className="hidden group-hover:block font-medium">Movies</span>
          </div>
        </div>
      </nav>

      {/* TOP SEARCH BAR */}
      <div className={`fixed top-0 right-0 w-full md:w-[calc(100%-80px)] p-4 flex justify-end items-center z-40 ${isSearchOpen ? 'bg-[#0f1014]' : 'bg-transparent'}`}>
        {isSearchOpen ? (
          <div className="flex items-center bg-gray-800/80 backdrop-blur-md rounded-lg px-4 py-2 w-full max-w-md border border-gray-700">
            <Search size={20} className="text-gray-400" />
            <input 
              autoFocus
              className="bg-transparent border-none outline-none text-white px-3 w-full"
              placeholder="Movies, shows and more"
              value={query}
              onChange={handleInput}
            />
            <X size={20} className="text-gray-400 cursor-pointer" onClick={() => {setIsSearchOpen(false); onSearch(""); setQuery("");}} />
          </div>
        ) : (
          <div className="p-2 bg-gray-800/50 rounded-full cursor-pointer hover:bg-gray-700 transition" onClick={() => setIsSearchOpen(true)}>
            <Search size={22} className="text-gray-400" />
          </div>
        )}
      </div>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-[#0f1014]/95 backdrop-blur-md flex justify-around items-center border-t border-gray-800 z-50">
        <Home className="text-gray-400 hover:text-white" />
        <Tv className="text-gray-400 hover:text-white" />
        <Film className="text-gray-400 hover:text-white" />
        <Search className="text-gray-400" onClick={() => setIsSearchOpen(true)} />
      </nav>
    </>
  );
};

export default Navbar;