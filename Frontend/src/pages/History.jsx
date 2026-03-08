import React, { useState, useEffect } from 'react';
import { Calendar, LayoutGrid, List } from 'lucide-react';
import api from '../services/api';

const mockHistory = [
    { id: 31, title: 'Inception', watchedAt: 'Oct 24, 2023', poster: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=500&q=80' },
    { id: 32, title: 'Interstellar', watchedAt: 'Oct 20, 2023', poster: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=500&q=80' },
    { id: 33, title: 'The Dark Knight', watchedAt: 'Oct 15, 2023', poster: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=500&q=80' },
    { id: 34, title: 'Dune', watchedAt: 'Oct 10, 2023', poster: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80' },
    { id: 35, title: 'Arrival', watchedAt: 'Oct 05, 2023', poster: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=500&q=80' },
    { id: 36, title: 'The Prestige', watchedAt: 'Sep 28, 2023', poster: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=500&q=80' },
    { id: 37, title: 'Joker', watchedAt: 'Sep 22, 2023', poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80' },
    { id: 38, title: 'Parasite', watchedAt: 'Sep 15, 2023', poster: 'https://images.unsplash.com/photo-1507676184212-d0330a15233e?auto=format&fit=crop&w=500&q=80' },
    { id: 39, title: 'Spider-Verse', watchedAt: 'Sep 08, 2023', poster: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80' }
];

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All Activity');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const res = await api.get('/history');
                const data = res.data.data || res.data;
                setHistory(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Failed to fetch history:', error);
                setHistory([]);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div className="min-h-screen bg-netflix-dark pt-24 px-4 sm:px-8 lg:px-12 pb-20">
            <div className="max-w-7xl mx-auto text-white">

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-gray-800">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black mb-3">Watch History</h1>
                        <p className="text-gray-400 text-sm">Manage and revisit your recently viewed movies and series.</p>
                    </div>

                    <div className="flex gap-1 mt-4 md:mt-0">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold rounded shadow-sm transition-colors ${viewMode === 'grid' ? 'bg-netflix-red text-white' : 'bg-[#1a1a1a] text-gray-400 hover:text-white border border-[#333]'}`}
                        >
                            <LayoutGrid className="w-4 h-4" /> Grid
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold rounded shadow-sm transition-colors ${viewMode === 'list' ? 'bg-netflix-red text-white' : 'bg-[#1a1a1a] text-gray-400 hover:text-white border border-[#333]'}`}
                        >
                            <List className="w-4 h-4" /> List
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-8 mb-8">
                    {['All Activity', 'Movies', 'TV Shows'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-2 font-medium text-[13px] tracking-wide transition-colors relative ${activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute -bottom-1 left-0 w-full h-[3px] bg-netflix-red rounded-t-full"></div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Grid Display Mode */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-netflix-red"></div>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-12">
                        {history.length > 0 ? history.map(item => {
                            const movie = item.movieId || {};
                            return (
                                <div key={item._id || item.id} className="relative group cursor-pointer">
                                    <div className="w-full aspect-[2/3] rounded-lg overflow-hidden bg-[#111] border border-gray-800 shadow-md">
                                        <img src={movie.posterUrl || item.poster} alt={movie.title} className="w-full h-full object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                                    </div>
                                    <h3 className="font-bold text-white text-[15px] leading-tight mt-3 mb-1 truncate">{movie.title}</h3>
                                    <p className="text-gray-400 text-xs flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Watched {new Date(item.watchedAt).toLocaleDateString()}</p>
                                </div>
                            );
                        }) : (
                            <div className="col-span-full py-20 text-center text-gray-500">No watch history found.</div>
                        )}

                        {/* Load More Card Simulator */}
                        <div className="w-full aspect-[2/3] rounded-lg border-2 border-dashed border-gray-800 flex flex-col items-center justify-center text-gray-600 hover:text-netflix-red hover:border-netflix-red transition-colors cursor-pointer group">
                            <div className="w-12 h-12 rounded-full border border-gray-700 group-hover:border-netflix-red/30 bg-gray-900 group-hover:bg-netflix-red/10 flex items-center justify-center mb-3">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" /></svg>
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider">LOAD MORE</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {history.length > 0 ? history.map(item => {
                            const movie = item.movieId || {};
                            return (
                                <div key={item._id || item.id} className="flex gap-4 items-center bg-[#111] border border-gray-800 rounded-lg p-3 hover:bg-[#1a1a1a] transition cursor-pointer">
                                    <img src={movie.posterUrl || item.poster} alt={movie.title} className="w-16 h-24 object-cover rounded" />
                                    <div>
                                        <h3 className="font-bold text-lg text-white mb-1">{movie.title}</h3>
                                        <p className="text-gray-400 text-sm flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Watched {new Date(item.watchedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="py-20 text-center text-gray-500">No watch history found.</div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default History;
