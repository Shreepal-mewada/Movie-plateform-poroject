import React from 'react';
import { useNavigate } from 'react-router-dom';

const WideMovieCard = ({ movie, index }) => {
    const navigate = useNavigate();
    const id = movie.id || movie._id;

    return (
        <div
            onClick={() => navigate(`/movie/${id}`)}
            className="group cursor-pointer min-w-[300px] md:min-w-[400px] flex-shrink-0 snap-start"
        >
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-4 bg-[#111] border border-white/5 transition-all duration-500 group-hover:scale-[1.02] group-hover:border-netflix-red/50 shadow-2xl">
                {/* Background Image */}
                <img
                    src={movie.backdrop_path ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}` : (movie.backdrop || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80')}
                    alt={movie.title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition duration-500"
                />

                {/* Overlay with Number */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col items-center justify-center">
                    <span className="text-[10px] font-black tracking-[0.3em] text-white/40 group-hover:text-netflix-red/80 transition uppercase mb-1">Popular</span>
                    <span className="text-7xl md:text-8xl font-black text-white/90 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] leading-[0.8] mb-2">{index + 1}</span>
                </div>
            </div>

            <div className="space-y-1">
                <h3 className="text-white font-black text-lg tracking-tight truncate group-hover:text-netflix-red transition-colors">
                    {movie.title || movie.name}
                </h3>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                    {(movie.release_date || movie.first_air_date || '').split('-')[0] || movie.year} • {movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : (movie.duration || '2h 15m')}
                </p>
            </div>
        </div>
    );
};

export default WideMovieCard;
