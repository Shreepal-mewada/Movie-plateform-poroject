import React, { useState, useEffect } from 'react';
import api from '../services/api';
import MovieCard from '../components/MovieCard';
import { DefaultSkeleton } from '../components/LoadingSkeleton';
import { Trash2 } from 'lucide-react';

const mockFavorites = [
    { id: 10, title: 'Inception', rating: '8.8', year: '2010', genre: 'Sci-Fi • Action', poster: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=500&q=80' },
    { id: 11, title: 'The Dark Knight', rating: '9.0', year: '2008', genre: 'Action • Drama', poster: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=500&q=80' },
    { id: 12, title: 'Interstellar', rating: '8.7', year: '2014', genre: 'Adventure • Sci-Fi', poster: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=500&q=80' },
    { id: 13, title: 'Pulp Fiction', rating: '8.9', year: '1994', genre: 'Crime • Drama', poster: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=500&q=80' },
    { id: 14, title: 'The Matrix', rating: '8.7', year: '1999', genre: 'Sci-Fi • Action', poster: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=500&q=80' },
    { id: 15, title: 'Parasite', rating: '8.5', year: '2019', genre: 'Drama • Thriller', poster: 'https://images.unsplash.com/photo-1507676184212-d0330a15233e?auto=format&fit=crop&w=500&q=80' }
];

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All Content');

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                setLoading(true);
                const res = await api.get('/favorites');
                const data = res.data.data || res.data;
                setFavorites(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Failed to fetch favorites:', error);
                setFavorites([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    const handleRemove = async (movieId) => {
        try {
            await api.delete('/favorites/remove', { data: { movieId } });
            setFavorites(favorites.filter((m) => (m._id || m.id) !== movieId));
        } catch (error) {
            console.error('Failed to remove favorite:', error);
        }
    };

    return (
        <div className="min-h-screen bg-netflix-dark pt-24 px-4 sm:px-8 lg:px-12 pb-20">

            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">My Favorites</h1>
                <p className="text-gray-400 mb-8 max-w-2xl">
                    Your personally curated collection of must-watch movies and series. Access your saved content anytime from any device.
                </p>

                {/* Tabs */}
                <div className="flex gap-8 border-b border-gray-800 mb-8">
                    {['All Content', 'Movies', 'TV Shows', 'Documentaries'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 font-medium text-sm transition-colors relative ${activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            {tab} {tab === 'All Content' && `(${favorites.length})`}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-netflix-red rounded-t-full"></div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Grid Content */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="aspect-[2/3]">
                                <DefaultSkeleton />
                            </div>
                        ))}
                    </div>
                ) : favorites.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 gap-y-10">
                            {favorites.map((movie) => (
                                <div key={movie.id} className="relative group flex flex-col">
                                    {/* Using MovieCard but overriding the hover actions slightly to show 'Remove' */}
                                    <div className="w-full aspect-[2/3] rounded-md overflow-hidden bg-gray-900 shadow-lg relative cursor-pointer">
                                        <img src={movie.posterUrl || movie.poster} alt={movie.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100" />

                                        <div className="absolute top-2 right-2 bg-netflix-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                                            {movie.rating}
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <h3 className="text-white font-bold truncate">{movie.title}</h3>
                                        <p className="text-gray-500 text-xs mt-1 truncate">{movie.year} • {movie.genre?.join(' • ') || movie.genre}</p>
                                        <button
                                            onClick={() => handleRemove(movie._id || movie.id)}
                                            className="mt-4 flex items-center justify-center gap-2 w-full py-2 rounded-md border border-netflix-red/30 text-netflix-red text-xs font-bold hover:bg-netflix-red hover:text-white transition-all duration-300 group/btn shadow-sm active:scale-95"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 group-hover/btn:animate-bounce" />
                                            REMOVE FROM LIST
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 flex justify-center">
                            <button className="border border-netflix-red text-netflix-red hover:bg-netflix-red hover:text-white transition-colors duration-300 font-bold py-3 px-8 rounded-md bg-transparent">
                                Load More Favorites
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="py-20 text-center flex flex-col items-center justify-center">
                        <div className="text-gray-600 mb-4 text-6xl">🎬</div>
                        <h3 className="text-2xl font-bold text-gray-300 mb-2">No favorites yet</h3>
                        <p className="text-gray-500 max-w-sm">Start exploring and add movies to your list to keep track of what you want to watch.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favorites;
