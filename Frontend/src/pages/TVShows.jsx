import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import HeroBanner from '../components/HeroBanner';
import MovieCard from '../components/MovieCard';
import { HeroSkeleton } from '../components/LoadingSkeleton';
import TrailerModal from '../components/TrailerModal';
import { useToast } from '../context/ToastContext';

const mockTVShows = [
    { id: 301, title: 'Cyber City', rating: '8.9', year: '2024-Present', genre: 'Sci-Fi • Action', poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=500&q=80', backdrop_path: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=2000&q=80' },
    { id: 302, title: 'The Peak', rating: '8.2', year: '2023-Present', genre: 'Adventure', poster: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=500&q=80', backdrop_path: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=80' },
    { id: 303, title: 'Royal Court', rating: '8.5', year: '2024', genre: 'Drama', poster: 'https://images.unsplash.com/photo-1449156001931-828320f3f635?auto=format&fit=crop&w=500&q=80', backdrop_path: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80' },
    { id: 304, title: 'Neon Night', rating: '7.4', year: '2024', genre: 'Music', poster: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=500&q=80', backdrop_path: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&w=2000&q=80' }
];

const mockHero = {
    id: 301,
    title: 'Stranger Things',
    description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
    backdrop_path: '/placeholder',
    tag: 'POPULAR SERIES'
};

const TVShows = () => {
    const [shows, setShows] = useState(mockTVShows);
    const [loading, setLoading] = useState(true);
    const [heroMovie, setHeroMovie] = useState(mockHero);
    const [modalOpen, setModalOpen] = useState(false);
    const [trailerKey, setTrailerKey] = useState('');
    const navigate = useNavigate();

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
        const fetchContent = async () => {
            try {
                setLoading(true);
                const res = await api.get('/movies/popular/tv');
                if (res.data && res.data.success) {
                    const data = res.data.data;
                    const showsData = data.results || (Array.isArray(data) ? data : []);
                    if (showsData.length > 0) {
                        setShows(showsData);
                        setHeroMovie(showsData[0]);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch TV shows from backend:', error);
                setShows([]);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-netflix-dark text-white">
                <HeroSkeleton />
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen pb-20 overflow-x-hidden">
            <HeroBanner
                movie={heroMovie}
                onWatchTrailer={async () => {
                    try {
                        const res = await api.get(`/movies/tv/${heroMovie.id}`);
                        if (res.data && res.data.success) {
                            const videos = res.data.data.videos?.results || [];
                            const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube') || videos[0];
                            if (trailer) {
                                setTrailerKey(trailer.key);
                                setModalOpen(true);
                            } else {
                                addToast('No trailer available.', 'error');
                            }
                        }
                    } catch (error) {
                        console.error('Trailer fetch error:', error);
                    }
                }}
                onMoreInfo={() => navigate(`/movie/${heroMovie?.id}`)}
            />

            <div className="relative z-10 px-4 sm:px-8 lg:px-12 space-y-12 pt-12">
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide">TV Series</h2>
                        <div className="w-2 h-2 rounded-full bg-netflix-red" />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {shows.map((show) => (
                            <MovieCard key={show.id} movie={show} onAddFavorite={addToFavorites} />
                        ))}
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

export default TVShows;
