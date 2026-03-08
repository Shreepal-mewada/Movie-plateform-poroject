import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import HeroBanner from '../components/HeroBanner';
import MovieCard from '../components/MovieCard';
import WideMovieCard from '../components/WideMovieCard';
import { HeroSkeleton, MovieCardSkeleton } from '../components/LoadingSkeleton';
import TrailerModal from '../components/TrailerModal';
import { useToast } from '../context/ToastContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Home = () => {
    const [trending, setTrending] = useState([]);
    const [popular, setPopular] = useState([]);
    const [heroMovie, setHeroMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [trailerKey, setTrailerKey] = useState('');

    const trendingRef = useRef(null);
    const popularRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                const [trendingRes, popularRes] = await Promise.all([
                    api.get('/movies/trending'),
                    api.get('/movies/popular')
                ]);

                if (trendingRes.data && trendingRes.data.success) {
                    const data = trendingRes.data.data;
                    const trendingData = data.results || (Array.isArray(data) ? data : []);
                    setTrending(trendingData);
                    if (trendingData.length > 0) setHeroMovie(trendingData[0]);
                }

                if (popularRes.data && popularRes.data.success) {
                    const data = popularRes.data.data;
                    const popularData = data.results || (Array.isArray(data) ? data : []);
                    setPopular(popularData);
                }
            } catch (error) {
                console.error('Failed to fetch movies:', error);
                setTrending([]);
                setPopular([]);
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);

    const handleScroll = (ref, direction) => {
        if (ref.current) {
            const { scrollLeft, clientWidth } = ref.current;
            const scrollAmount = clientWidth * 0.8;
            const targetScroll = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
            ref.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
        }
    };

    const handleWatchTrailer = async (movie) => {
        try {
            const res = await api.get(`/movies/${movie.id}`);
            if (res.data && res.data.success) {
                const videos = res.data.data.videos?.results || [];
                const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube') || videos[0];
                if (trailer) {
                    setTrailerKey(trailer.key);
                    setModalOpen(true);
                } else {
                    addToast('No trailer available for this movie.', 'error');
                }
            }
        } catch (error) {
            console.error('Failed to fetch trailer:', error);
            addToast('Failed to load trailer.', 'error');
        }
    };

    const handleMoreInfo = (movie) => {
        if (movie?.id) navigate(`/movie/${movie.id}`);
    };

    const { addToast } = useToast();

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

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-netflix-dark text-white">
                <HeroSkeleton />
                <div className="px-4 sm:px-12 mt-8">
                    <div className="h-6 w-48 bg-gray-800 animate-pulse rounded mb-6"></div>
                    <div className="flex gap-4 overflow-hidden">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="min-w-[200px] w-1/5"><MovieCardSkeleton /></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen pb-20 overflow-x-hidden bg-netflix-dark text-white font-sans">
            {heroMovie && (
                <HeroBanner
                    movie={heroMovie}
                    onWatchTrailer={handleWatchTrailer}
                    onMoreInfo={handleMoreInfo}
                />
            )}

            <div className="relative px-4 sm:px-8 lg:px-12 pb-12 space-y-20 max-w-[1700px] mx-auto pt-24">
                {/* Trending Section */}
                <section className="relative group/section">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">
                                Trending Today
                            </h2>
                            <div className="w-2 h-2 rounded-full bg-netflix-red animate-pulse" />
                        </div>
                        <button
                            onClick={() => navigate('/movies')}
                            className="text-netflix-red text-sm font-black hover:text-white transition-all uppercase tracking-widest border-b-2 border-transparent hover:border-netflix-red pb-0.5"
                        >
                            View All
                        </button>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => handleScroll(trendingRef, 'left')}
                            className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-30 bg-black/60 p-2 rounded-full opacity-0 group-hover/section:opacity-100 transition-opacity hover:bg-netflix-red border border-white/10 hidden md:block"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        <div
                            ref={trendingRef}
                            className="flex overflow-x-auto gap-4 md:gap-5 pb-6 pt-2 no-scrollbar snap-x scroll-smooth"
                        >
                            {trending.map((movie) => (
                                <div key={movie.id} className="min-w-[140px] md:min-w-[180px] lg:min-w-[220px] flex-shrink-0 snap-start">
                                    <MovieCard movie={movie} onAddFavorite={addToFavorites} />
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => handleScroll(trendingRef, 'right')}
                            className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-30 bg-black/60 p-2 rounded-full opacity-0 group-hover/section:opacity-100 transition-opacity hover:bg-netflix-red border border-white/10 hidden md:block"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </section>

                {/* Popular Movies Section */}
                <section className="relative group/section">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">
                                Popular Movies
                            </h2>
                        </div>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => handleScroll(popularRef, 'left')}
                            className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-30 bg-black/60 p-2 rounded-full opacity-0 group-hover/section:opacity-100 transition-opacity hover:bg-netflix-red border border-white/10 hidden md:block"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        <div
                            ref={popularRef}
                            className="flex overflow-x-auto gap-4 md:gap-6 pb-6 pt-2 no-scrollbar snap-x scroll-smooth"
                        >
                            {popular.map((movie, index) => (
                                <WideMovieCard key={movie.id} movie={movie} index={index} />
                            ))}
                        </div>

                        <button
                            onClick={() => handleScroll(popularRef, 'right')}
                            className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-30 bg-black/60 p-2 rounded-full opacity-0 group-hover/section:opacity-100 transition-opacity hover:bg-netflix-red border border-white/10 hidden md:block"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </section>
            </div>

            {trailerKey && (
                <TrailerModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    trailerKey={trailerKey}
                />
            )}
        </div>
    );
};

export default Home;
