import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronDown, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';
import MovieCard from '../components/MovieCard';
import { useToast } from '../context/ToastContext';

const Search = () => {
    const { addToast } = useToast();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q') || '';

    // Filter State
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [isGenreOpen, setIsGenreOpen] = useState(false);
    const [isYearOpen, setIsYearOpen] = useState(false);

    // Years list (e.g., from current year down to 1990)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 35 }, (_, i) => (currentYear - i).toString());

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const res = await api.get('/movies/genres');
                if (res.data && res.data.success) {
                    setGenres(res.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch genres:', error);
            }
        };
        fetchGenres();
    }, []);

    const addToFavorites = async (movie) => {
        try {
            const movieId = movie.id || movie._id;
            await api.post('/favorites/add', { movieId });
            addToast(`"${movie.title || movie.name}" added to favorites!`, 'success');
        } catch (error) {
            console.error('Favorite error:', error);
            addToast(error.response?.data?.message || 'Failed to add to favorites. Make sure you are logged in.', 'error');
        }
    };

    useEffect(() => {
        const fetchResults = async () => {
            if (!query && !selectedGenre) return;
            try {
                setLoading(true);
                let url = `/movies/search?query=${query}`;
                if (selectedGenre) url += `&genre=${selectedGenre}`;
                if (selectedYear) url += `&year=${selectedYear}`;

                const res = await api.get(url);
                if (res.data && res.data.success) {
                    const data = res.data.data;
                    setResults(data.results || (Array.isArray(data) ? data : []));
                }
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [query, selectedGenre, selectedYear]);

    return (
        <div className="min-h-screen bg-netflix-dark pt-24 px-4 sm:px-8 lg:px-12 pb-20 text-white font-sans">
            <div className="max-w-7xl mx-auto">

                {/* Breadcrumbs & Header */}
                <div className="mb-8">
                    <div className="text-xs text-gray-500 font-bold tracking-wider mb-2 flex items-center gap-2">
                        <Link to="/" className="hover:text-white transition">HOME</Link>
                        <span>›</span>
                        <span className="text-gray-300">SEARCH RESULTS</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2">
                                Results for <span className="text-netflix-red italic">"{query}"</span>
                            </h1>
                            <p className="text-gray-400 text-sm">Showing {results.length} titles found</p>
                        </div>

                        <div className="flex gap-3 flex-wrap">
                            {/* Genre Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsGenreOpen(!isGenreOpen)}
                                    className={`flex items-center gap-2 bg-[#1a1a1a] border ${selectedGenre ? 'border-netflix-red text-netflix-red' : 'border-[#333] text-gray-300'} hover:border-gray-500 px-4 py-2 rounded-md text-sm font-medium transition`}
                                >
                                    {selectedGenre ? genres.find(g => g.id.toString() === selectedGenre)?.name : 'Genre'}
                                    <ChevronDown className={`w-4 h-4 transition-transform ${isGenreOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isGenreOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsGenreOpen(false)}></div>
                                        <div className="absolute top-full mt-2 left-0 w-48 bg-[#1a1a1a] border border-[#333] rounded-md shadow-2xl z-20 py-2 max-h-60 overflow-y-auto custom-scrollbar">
                                            <button
                                                onClick={() => { setSelectedGenre(''); setIsGenreOpen(false); }}
                                                className="w-full text-left px-4 py-2 text-sm hover:bg-[#333] transition"
                                            >
                                                All Genres
                                            </button>
                                            {genres.map(genre => (
                                                <button
                                                    key={genre.id}
                                                    onClick={() => { setSelectedGenre(genre.id.toString()); setIsGenreOpen(false); }}
                                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-[#333] transition ${selectedGenre === genre.id.toString() ? 'text-netflix-red font-bold' : ''}`}
                                                >
                                                    {genre.name}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Year Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsYearOpen(!isYearOpen)}
                                    className={`flex items-center gap-2 bg-[#1a1a1a] border ${selectedYear ? 'border-netflix-red text-netflix-red' : 'border-[#333] text-gray-300'} hover:border-gray-500 px-4 py-2 rounded-md text-sm font-medium transition`}
                                >
                                    {selectedYear || 'Year'}
                                    <ChevronDown className={`w-4 h-4 transition-transform ${isYearOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isYearOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsYearOpen(false)}></div>
                                        <div className="absolute top-full mt-2 left-0 w-32 bg-[#1a1a1a] border border-[#333] rounded-md shadow-2xl z-20 py-2 max-h-60 overflow-y-auto custom-scrollbar">
                                            <button
                                                onClick={() => { setSelectedYear(''); setIsYearOpen(false); }}
                                                className="w-full text-left px-4 py-2 text-sm hover:bg-[#333] transition"
                                            >
                                                All Years
                                            </button>
                                            {years.map(year => (
                                                <button
                                                    key={year}
                                                    onClick={() => { setSelectedYear(year); setIsYearOpen(false); }}
                                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-[#333] transition ${selectedYear === year ? 'text-netflix-red font-bold' : ''}`}
                                                >
                                                    {year}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            {(selectedGenre || selectedYear) && (
                                <button
                                    onClick={() => { setSelectedGenre(''); setSelectedYear(''); }}
                                    className="text-gray-500 hover:text-white text-xs font-bold uppercase tracking-wider underline underline-offset-4"
                                >
                                    Reset Filters
                                </button>
                            )}

                            <button className="flex items-center gap-2 bg-netflix-red text-white px-4 py-2 rounded-md text-sm font-bold shadow-lg hover:bg-red-700 transition">
                                Filter <Filter className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-8 border-b border-gray-800 mb-8 pb-3">
                    <button className="font-semibold text-sm transition-colors relative text-white pb-3">
                        All Results ({results.length})
                        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-netflix-red rounded-t-full"></div>
                    </button>
                </div>

                {/* Results Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-netflix-red"></div>
                    </div>
                ) : results.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8 lg:gap-x-6 lg:gap-y-10">
                            {results.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} onAddFavorite={addToFavorites} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-center mt-12 gap-2 text-sm">
                            <button className="w-10 h-10 rounded border border-[#333] bg-[#1a1a1a] flex items-center justify-center hover:bg-[#222] transition text-gray-400">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button className="w-10 h-10 rounded bg-netflix-red text-white flex items-center justify-center font-bold shadow-md">1</button>
                            <button className="w-10 h-10 rounded border border-[#333] bg-[#1a1a1a] flex items-center justify-center hover:bg-[#222] transition text-gray-400">2</button>
                            <button className="w-10 h-10 rounded border border-[#333] bg-[#1a1a1a] flex items-center justify-center hover:bg-[#222] transition text-gray-400">3</button>
                            <span className="w-8 h-10 flex items-center justify-center text-gray-500">...</span>
                            <button className="w-10 h-10 rounded border border-[#333] bg-[#1a1a1a] flex items-center justify-center hover:bg-[#222] transition text-gray-400">12</button>
                            <button className="w-10 h-10 rounded border border-[#333] bg-[#1a1a1a] flex items-center justify-center hover:bg-[#222] transition text-gray-400">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="py-20 text-center flex flex-col items-center justify-center">
                        <div className="text-gray-600 mb-4 text-6xl">🔍</div>
                        <h3 className="text-2xl font-bold text-gray-300 mb-2">No results found</h3>
                        <p className="text-gray-500 max-w-sm">We couldn't find anything matching "{query}". Try different keywords.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
