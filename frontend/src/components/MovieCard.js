import React from 'react';

const MovieCard = ({ movie, onPreview, onRate, currentStats }) => {
  return (
    <div className="group bg-[#16181f] rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-600 transition-all shadow-xl">
      <div className="relative overflow-hidden">
        <img 
           src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
           className="w-full h-64 md:h-80 object-cover group-hover:scale-110 transition-transform duration-500" 
           alt={movie.title} 
        />
        {/* Play Button Overlay */}
        <div 
          onClick={() => onPreview(movie.id)}
          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <div className="bg-[#38bdf8] p-4 rounded-full text-black shadow-lg shadow-[#38bdf8]/50">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold truncate w-[70%]">{movie.title}</h3>
          <span className="text-[10px] text-gray-400">👁️ {currentStats?.views || 0}</span>
        </div>

        <div className="flex gap-1 mb-4">
          {[1,2,3,4,5].map(s => (
            <span 
              key={s} 
              onClick={() => onRate(movie.id, s)} 
              className={`cursor-pointer text-lg transition-colors ${s <= (currentStats?.avg || 0) ? "text-[#ffb703]" : "text-gray-700"}`}
            >★</span>
          ))}
        </div>

        <button 
          onClick={() => onPreview(movie.id)} 
          className="w-full py-2.5 bg-gray-800 hover:bg-[#38bdf8] hover:text-black transition-colors rounded-lg text-xs font-bold uppercase tracking-wider"
        >
          Watch Trailer
        </button>
      </div>
    </div>
  );
};

export default MovieCard;