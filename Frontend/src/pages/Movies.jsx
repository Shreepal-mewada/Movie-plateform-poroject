import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import HeroBanner from '../components/HeroBanner';
import MovieCard from '../components/MovieCard';
import { HeroSkeleton } from '../components/LoadingSkeleton';
import TrailerModal from '../components/TrailerModal';
import { useToast } from '../context/ToastContext';

const mockMovies = [
    { id: 201, title: 'The Silent Forest', rating: '8.4', year: '2023', genre: 'Mystery • Thriller', poster: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=500&q=80', backdrop_path: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2000&q=80' },
    { id: 202, title: 'Urban Legend', rating: '7.8', year: '2024', genre: 'Mystery', poster: 'https://images.unsplash.com/photo-1604004555489-723a93d6ce74?auto=format&fit=crop&w=500&q=80', backdrop_path: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=2000&q=80' },
    { id: 203, title: 'Neon Pulse', rating: '8.1', year: '2024', genre: 'Action', poster: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&w=500&q=80', backdrop_path: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=2000&q=80' },
    { id: 204, title: 'Shadow Realm', rating: '8.9', year: '2024', genre: 'Fantasy', poster: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=500&q=80', backdrop_path: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=2000&q=80' },
    { id: 205, title: 'The Last Stand', rating: '7.5', year: '2023', genre: 'Action', poster: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=500&q=80', backdrop_path: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80' }
];

const mockHero = {
    id: 201,
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    backdrop_path: '/placeholder',
    tag: 'FEATURED MOVIE'
};

const Movies = () => {
    const [movies, setMovies] = useState(mockMovies);
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
                const res = await api.get('/movies/popular');
                if (res.data && res.data.success) {
                    const data = res.data.data;
                    const moviesData = data.results || (Array.isArray(data) ? data : []);
                    if (moviesData.length > 0) {
                        setMovies(moviesData);
                        setHeroMovie(moviesData[0]);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch movies from backend:', error);
                setMovies([]);
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
                        const res = await api.get(`/movies/${heroMovie.id}`);
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
                        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide">All Movies</h2>
                        <div className="w-2 h-2 rounded-full bg-netflix-red" />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {movies.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} onAddFavorite={addToFavorites} />
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

export default Movies;
