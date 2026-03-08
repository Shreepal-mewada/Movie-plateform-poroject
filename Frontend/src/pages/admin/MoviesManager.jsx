import React, { useState, useEffect } from 'react';
import { Search, Plus, Bell, Filter, Download, Edit3, Trash2, ArrowUpRight } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const mockMovies = [
    { _id: '1', title: 'Interstellar', releaseDate: '2014-11-07', genre: ['SCI-FI', 'ADVENTURE'], tmdbId: 157338, posterUrl: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=50&q=80' },
];

const MoviesManager = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [trailerKey, setTrailerKey] = useState('');
    const { addToast } = useToast();

    const fetchMovies = async () => {
        try {
            setLoading(true);
            // Fetch trending as a base if no admin list exists, or a proper admin list
            const res = await api.get('/movies/trending');
            if (res.data && res.data.success) {
                const data = res.data.data;
                const results = data.results || (Array.isArray(data) ? data : []);
                setMovies(results);
            }
        } catch (error) {
            console.error('Failed to fetch movies:', error);
            setMovies(mockMovies);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    const handleWatchTrailer = async (movie) => {
        try {
            const movieId = movie.id || movie._id;
            const res = await api.get(`/movies/${movieId}`);
            if (res.data && res.data.success) {
                const videos = res.data.data.videos?.results || [];
                const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube') || videos[0];
                if (trailer) {
                    setTrailerKey(trailer.key);
                    setModalOpen(true);
                } else {
                    addToast('No trailer available for this item.', 'info');
                }
            }
        } catch (error) {
            console.error('Failed to load trailer:', error);
            addToast('Could not fetch trailer data', 'error');
        }
    };

    const handleDeleteMovie = async (id) => {
        if (!window.confirm('Delete this movie from the system?')) return;

        try {
            const res = await api.delete(`/admin/movie/${id}`);
            if (res.data.success) {
                addToast('Movie removed from catalog', 'success');
                setMovies(movies.filter(m => (m._id || m.id) !== id));
            }
        } catch (error) {
            // Since we might be using TMDB results which aren't in our local DB yet
            if (error.response?.status === 404) {
                addToast('Movie not found in local database (might be remote TMDB data)', 'info');
                setMovies(movies.filter(m => (m._id || m.id) !== id));
            } else {
                addToast(error.response?.data?.message || 'Delete failed', 'error');
            }
        }
    };

    return (
        <div className="flex flex-col h-full overflow-hidden bg-[#0f0f13]">

            {/* Top Header */}
            <header className="flex items-center justify-between px-8 py-5 border-b border-[#222] bg-[#141418]">
                <h1 className="text-2xl font-black uppercase tracking-tighter text-white">Catalog Management</h1>

                <div className="flex items-center gap-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Filter catalog..."
                            className="bg-[#1a1a20] border border-[#2a2a30] text-sm text-white rounded-md pl-10 pr-4 py-2 w-64 focus:outline-none focus:border-gray-500 transition-colors"
                        />
                    </div>

                    <button className="flex items-center gap-2 bg-netflix-red text-white px-4 py-2 rounded-md font-black text-xs uppercase tracking-widest hover:bg-red-700 transition shadow-lg shadow-red-500/10">
                        <Plus className="w-4 h-4" /> Add Asset
                    </button>

                    <button className="text-gray-400 hover:text-white transition relative">
                        <Bell className="w-5 h-5 fill-current" />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-netflix-red rounded-full"></span>
                    </button>
                </div>
            </header>

            {/* Main Content Body */}
            <div className="flex-1 overflow-auto p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-bold mb-1 text-white">System Inventory</h2>
                        <p className="text-gray-400 text-sm">Synchronized with TMDB Global Database and local storage.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 bg-[#1a1a20] border border-[#2a2a30] hover:border-gray-600 text-gray-400 px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition">
                            <Filter className="w-4 h-4" /> Filter
                        </button>
                        <button className="flex items-center gap-2 bg-[#1a1a20] border border-[#2a2a30] hover:border-gray-600 text-gray-400 px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition">
                            <Download className="w-4 h-4" /> Export CSV
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="border border-[#222] rounded-xl overflow-hidden bg-[#141418] shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#222] text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] bg-[#1a1a20]">
                                <th className="px-6 py-5 w-24">Poster</th>
                                <th className="px-6 py-5">Asset Details</th>
                                <th className="px-6 py-5">TMDB Reference</th>
                                <th className="px-6 py-5">Connectivity</th>
                                <th className="px-6 py-5 text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#222]">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16 text-center text-gray-500 animate-pulse uppercase text-xs font-black tracking-widest">Hydrating Catalog Data...</td>
                                </tr>
                            ) : (Array.isArray(movies) && movies.length > 0) ? movies.map(movie => (
                                <tr key={movie._id || movie.id} className="hover:bg-[#1a1a20] transition-colors group">
                                    <td className="px-6 py-4">
                                        <img
                                            src={movie.posterUrl || (movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : movie.poster)}
                                            alt={movie.title}
                                            className="w-10 h-14 object-cover rounded-md border border-gray-800 shadow-md group-hover:scale-105 transition-transform"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-white text-sm mb-0.5">{movie.title}</div>
                                        <div className="text-[10px] text-gray-500 font-black tracking-widest uppercase">
                                            {Array.isArray(movie.genre) ? movie.genre.join(', ') : (movie.genre || 'Action')}
                                            <span className="mx-2 text-gray-700">|</span>
                                            {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : (movie.release_date ? new Date(movie.release_date).getFullYear() : '2024')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-[#1a1a20] text-gray-400 text-[10px] px-2.5 py-1 rounded font-black border border-[#2a2a30] tracking-widest">
                                            TMDB-{movie.tmdbId || movie.id}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleWatchTrailer(movie)}
                                            className="flex items-center gap-1.5 text-netflix-red hover:text-red-400 text-[10px] font-black uppercase tracking-widest transition"
                                        >
                                            Link Trailer <ArrowUpRight className="w-3.5 h-3.5" />
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition" title="Edit Metadata">
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteMovie(movie._id || movie.id)}
                                                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-netflix-red transition"
                                                title="Hard Delete Asset"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16 text-center text-gray-500 uppercase text-xs font-black tracking-widest">Empty Inventory. Try adding assets manually.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="flex items-center justify-between mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                    <div>Showing <span className="text-white">{movies.length}</span> Active Assets</div>
                    <div className="flex gap-2">
                        <button className="w-8 h-8 rounded border border-[#2a2a30] bg-[#1a1a20] flex items-center justify-center hover:bg-[#222] transition">&lt;</button>
                        <button className="w-8 h-8 rounded bg-netflix-red text-white flex items-center justify-center shadow-lg shadow-red-500/20">1</button>
                        <button className="w-8 h-8 rounded border border-[#2a2a30] bg-[#1a1a20] flex items-center justify-center hover:bg-[#222] transition">&gt;</button>
                    </div>
                </div>
            </div>

            <TrailerModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                trailerKey={trailerKey}
            />
        </div>
    );
};

export default MoviesManager;
