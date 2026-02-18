import React from 'react';

const MovieCard = ({ movie, onPreview, onRate, currentStats }) => {
  return (
    <div className="group bg-[#16181f] rounded-md overflow-hidden border border-gray-800 transition-all hover:scale-105 duration-300 shadow-lg">
      {/* Poster Section - Clickable for VR */}
      <div 
        className="relative aspect-[2/3] overflow-hidden cursor-pointer" 
        onClick={() => onPreview(movie)}
      >
        <img 
           src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
           alt={movie.title} 
        />
        
        {/* Play Icon Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
           <div className="bg-[#38bdf8] p-2 rounded-full text-black shadow-lg">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
               <path d="M8 5v14l11-7z"/>
             </svg>
           </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-2">
        <h3 className="text-[10px] md:text-xs font-semibold truncate text-gray-200 mb-1">
          {movie.title || movie.name}
        </h3>
        
        <div className="flex justify-between items-center">
           <div className="flex gap-0.5">
             {[1,2,3,4,5].map(s => (
               <span 
                 key={s} 
                 onClick={(e) => {
                   e.stopPropagation();
                   onRate(movie.id, s);
                 }}
                 className={`cursor-pointer text-[10px] ${s <= (currentStats?.avg || 0) ? "text-[#ffb703]" : "text-gray-600"}`}
               >★</span>
             ))}
           </div>
           <span className="text-[9px] text-gray-500 font-medium">
             👁️ {currentStats?.views || 0}
           </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;