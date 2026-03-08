import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Info, Star } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const MovieCard = ({ movie, onAddFavorite }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!movie) return null;

    const title = movie.title || movie.name || 'Untitled';
    const id = movie.id || movie._id;
    const rating = movie.rating || (movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A');
    const year = movie.year || (movie.release_date || movie.first_air_date || '').split('-')[0] || '2024';
    const genre = Array.isArray(movie.genre) ? movie.genre.join(' • ') : (movie.genre || '');

    // Uses placeholder image if poster is not available
    const imgSource = movie.posterUrl || movie.poster || (movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=500&q=80');

    const handleDetails = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Details clicked for movie:', id, title);
        navigate(`/movie/${id}`);
    };

    const handleAddFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Add to favorite clicked for movie:', id, title);
        if (!user) {
            alert('Please login to add to favorites!');
            return;
        }
        if (onAddFavorite) onAddFavorite(movie);
    };

    return (
        <div
            onClick={handleDetails}
            className="group relative w-full aspect-[2/3] rounded-md overflow-hidden bg-gray-900 transition-transform duration-300 hover:scale-105 hover:z-20 shadow-lg cursor-pointer"
        >
            <img
                src={imgSource}
                alt={title}
                className="w-full h-full object-cover transition-opacity duration-300"
                loading="lazy"
            />

            {/* Rating badge - top right */}
            <div className="absolute top-3 right-3 z-10 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-black flex items-center gap-1 border border-white/10 shadow-lg">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-white">{rating || 'N/A'}</span>
            </div>

            {/* Hover details overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-20">

                <h3 className="font-bold text-base leading-tight mb-1 truncate drop-shadow-md text-white">{title}</h3>

                <div className="flex items-center text-[10px] text-gray-300 mb-3 gap-2 font-medium">
                    <span>{year || '2024'}</span>
                    <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                    <span className="truncate">{genre || 'Action • Sci-Fi'}</span>
                </div>

                <div className="flex items-center gap-1.5">
                    <button
                        onClick={handleDetails}
                        className="flex-1 bg-white text-black py-2 rounded-md flex justify-center items-center hover:bg-gray-200 transition-all duration-300 shadow-xl transform active:scale-95 group/btn"
                    >
                        <Info className="w-4 h-4 mr-1.5 text-black" />
                        <span className="text-[11px] font-black text-black">DETAILS</span>
                    </button>

                    <button
                        onClick={handleAddFavorite}
                        className="w-9 h-9 rounded-md border-2 border-gray-400/50 flex items-center justify-center hover:border-white hover:bg-white/20 transition-all duration-300 backdrop-blur-sm transform active:scale-95"
                        title="Add to Favorites"
                    >
                        <Plus className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
