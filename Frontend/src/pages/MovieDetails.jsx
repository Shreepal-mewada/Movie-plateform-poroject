import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Plus, Share2, Star } from 'lucide-react';
import api from '../services/api';
import TrailerModal from '../components/TrailerModal';
import { useToast } from '../context/ToastContext';

const mockMovie = {
    id: 1,
    title: 'Interstellar',
    rating: '8.7',
    reviews: '2.5M reviews',
    year: '2014',
    duration: '2h 49m',
    ageRating: 'PG-13',
    description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    genres: ['Sci-Fi', 'Drama', 'Adventure'],
    poster: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=500&q=80',
    backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
    cast: [
        { name: 'Matthew McConaughey', role: 'Cooper', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop' },
        { name: 'Anne Hathaway', role: 'Brand', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop' },
        { name: 'Jessica Chastain', role: 'Murph', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop' },
        { name: 'Michael Caine', role: 'Professor Brand', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' }
    ],
    details: {
        Director: 'Christopher Nolan',
        Writers: 'Jonathan Nolan, Christopher Nolan',
        ReleaseDate: 'Nov 7, 2014',
        Budget: '$165,000,000',
        Revenue: '$701,729,206'
    },
    keywords: ['ARTIFICIAL INTELLIGENCE', 'SPACE TRAVEL', 'WORMHOLE', 'RELATIVITY', 'FATHER DAUGHTER RELATIONSHIP']
};

const MovieDetails = () => {
    const { id } = useParams();
    const { addToast } = useToast();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [trailerKey, setTrailerKey] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/movies/${id}`);
                const data = res.data.data || res.data;
                setMovie(data);

                // Extract trailer key
                const videos = data.videos?.results || [];
                const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube') || videos[0];
                if (trailer) {
                    setTrailerKey(trailer.key);
                }
            } catch (error) {
                console.error('Failed to fetch movie details:', error);
                setMovie(mockMovie);
            } finally {
                setLoading(false);
            }
        };

        // Also record history internally
        if (id) {
            api.post('/history/add', { movieId: id }).catch(() => { });
        }

        fetchMovie();
    }, [id]);

    const addToFavorites = async () => {
        try {
            await api.post('/favorites/add', { movieId: id });
            addToast('Added to favorites!', 'success');
        } catch (error) {
            console.error('Favorite error:', error);
            addToast(error.response?.data?.message || 'Failed to add to favorites. Make sure you are logged in.', 'error');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-netflix-dark flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-netflix-red mb-4"></div>
            <p className="text-gray-500 font-medium animate-pulse">Loading cinematic experience...</p>
        </div>
    );

    if (!movie) return <div className="min-h-screen content-center text-center text-white">Movie not found.</div>;

    // Robust field extraction for both TMDB response and Local DB
    const bgImage = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : (movie.backdrop || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80');

    const posterImage = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : (movie.posterUrl || movie.poster || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=500&q=80');

    const title = movie.title || movie.name || 'Untitled';
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : (movie.rating || 'N/A');
    const year = (movie.release_date || movie.first_air_date || '').split('-')[0] || (movie.year || '2024');
    const duration = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : (movie.duration || '2h 15m');
    const description = movie.overview || movie.description || 'No description available.';

    // Proper Genre Mapping (TMDB returns [{name}])
    const movieGenres = movie.genres
        ? (Array.isArray(movie.genres) ? movie.genres.map(g => g.name || g) : [])
        : [];

    // Cast and Crew from tmdb response
    const cast = movie.credits?.cast?.slice(0, 10) || movie.cast || [];
    const director = movie.credits?.crew?.find(c => c.job === 'Director')?.name || movie.details?.Director || 'Unknown Director';
    const writers = movie.credits?.crew?.filter(c => ['Writer', 'Screenplay'].includes(c.job)).map(w => w.name).join(', ') || movie.details?.Writers || 'Unknown Writers';

    return (
        <div className="min-h-screen bg-netflix-dark pb-20 font-sans text-white">
            {/* Top Banner section */}
            <div className="relative w-full h-screen md:h-[90vh] flex flex-col md:flex-row items-center pt-24 px-4 sm:px-12 lg:px-24 overflow-hidden">
                <div className="absolute inset-0 z-0 scale-105">
                    <img src={bgImage} alt="" className="w-full h-full object-cover opacity-40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark via-netflix-dark/60 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-netflix-dark via-netflix-dark/40 to-transparent"></div>
                </div>

                {/* Poster Layer */}
                <div className="relative z-10 w-full md:w-1/3 lg:w-1/4 flex justify-center md:justify-start mb-8 md:mb-0">
                    <div className="w-48 sm:w-64 md:w-full max-w-[320px] rounded-lg overflow-hidden border-4 border-gray-800 shadow-[20px_20px_60px_rgba(0,0,0,1)] transform hover:scale-102 transition duration-500">
                        <img src={posterImage} alt={title} className="w-full object-cover" />
                    </div>
                </div>

                {/* Info Layer */}
                <div className="relative z-10 w-full md:w-2/3 lg:w-3/4 md:pl-12 flex flex-col items-center md:items-start text-center md:text-left">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-netflix-red text-white text-[10px] font-black px-2 py-0.5 rounded-sm tracking-widest uppercase shadow-lg">TOP RATED</span>
                        <div className="flex items-center text-yellow-500 font-bold text-sm">
                            <Star className="w-4 h-4 mr-1.5 fill-current" />
                            {rating} <span className="text-gray-400 font-normal ml-1.5 text-xs">({movie.vote_count || movie.reviews || '1.2k'} votes)</span>
                        </div>
                    </div>

                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter drop-shadow-2xl leading-[0.9]">
                        {title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 text-sm font-bold text-gray-300 mb-8 drop-shadow">
                        <span className="text-netflix-red">{year}</span>
                        <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                        <span>{duration}</span>
                        <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                        <span className="border border-gray-600 px-2 py-0.5 rounded text-[10px]">{movie.adult ? '18+' : 'PG-13'}</span>
                        {movie.status && (
                            <>
                                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                <span className="text-gray-400 uppercase tracking-tighter text-[11px]">{movie.status}</span>
                            </>
                        )}
                    </div>

                    <p className="text-gray-200 text-lg sm:text-xl lg:text-2xl leading-relaxed mb-10 max-w-4xl drop-shadow-md font-medium">
                        {description}
                    </p>

                    {/* Genres */}
                    <div className="flex flex-wrap gap-2.5 mb-10 justify-center md:justify-start">
                        {movieGenres.map((g, idx) => (
                            <span key={idx} className="px-5 py-2 bg-white/5 hover:bg-white/15 border border-white/10 rounded-full text-xs font-bold text-gray-200 transition cursor-default tracking-wide uppercase">
                                {g}
                            </span>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-4 mb-4 justify-center md:justify-start">
                        <button
                            onClick={() => setModalOpen(true)}
                            className="flex items-center gap-2.5 bg-netflix-red text-white py-4 px-8 sm:px-10 rounded shadow-2xl hover:bg-red-700 transition font-black uppercase tracking-wider transform active:scale-95 shadow-red-900/20"
                        >
                            <Play className="w-6 h-6 fill-current" /> Watch Trailer
                        </button>

                        <button
                            onClick={addToFavorites}
                            className="flex items-center gap-2.5 bg-[#2a2a2a] text-white py-4 px-8 sm:px-10 rounded shadow-2xl hover:bg-white hover:text-black transition-all duration-300 font-black uppercase tracking-wider border border-gray-700 transform active:scale-95"
                        >
                            <Plus className="w-6 h-6" /> Add to Favorites
                        </button>

                        <button className="flex items-center justify-center bg-[#2a2a2a]/80 text-white w-14 h-14 rounded shadow-2xl hover:bg-gray-600 transition border border-gray-700 backdrop-blur-md">
                            <Share2 className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Details Sections */}
            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-12 mt-20 grid grid-cols-1 lg:grid-cols-3 gap-16">

                {/* Left Col: Cast & Storyline */}
                <div className="lg:col-span-2 space-y-16">
                    <section>
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-3xl font-black tracking-tight uppercase">Top Cast</h2>
                            <div className="h-0.5 flex-1 bg-gradient-to-r from-netflix-red/50 to-transparent"></div>
                        </div>
                        <div className="flex gap-6 sm:gap-8 overflow-x-auto pb-6 no-scrollbar flex-nowrap shrink-0 snap-x">
                            {cast.length > 0 ? cast.map((c, idx) => {
                                const name = c.name || 'Unknown';
                                const role = c.character || c.role || 'N/A';
                                const image = c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : (c.image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop');
                                return (
                                    <div key={idx} className="flex flex-col items-center text-center w-28 shrink-0 snap-start group">
                                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-netflix-red transition duration-300 transform group-hover:scale-110 shadow-lg mb-4">
                                            <img src={image} alt={name} className="w-full h-full object-cover" />
                                        </div>
                                        <h4 className="text-sm font-black text-gray-100 leading-tight mb-1 truncate w-full">{name}</h4>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter truncate w-full">{role}</p>
                                    </div>
                                );
                            }) : (
                                <p className="text-gray-500 italic">No cast information available.</p>
                            )}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-black mb-6 uppercase tracking-tight">Storyline</h2>
                        <p className="text-gray-400 text-lg leading-relaxed max-w-3xl text-justify font-medium">
                            {description}
                        </p>
                    </section>
                </div>

                {/* Right Col: Details Board & Keywords */}
                <div className="space-y-10">
                    <div className="bg-[#111] p-8 rounded-xl border border-white/5 shadow-2xl">
                        <h3 className="text-xs font-black text-netflix-red tracking-[0.2em] mb-8 uppercase">Production Details</h3>
                        <div className="space-y-6 text-sm">
                            <div className="flex justify-between border-b border-white/5 pb-4">
                                <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Director</span>
                                <span className="font-extrabold text-right max-w-[60%] text-gray-200">{director}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-4">
                                <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Writers</span>
                                <span className="font-extrabold text-right max-w-[60%] text-gray-200">{writers}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-4">
                                <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Release Date</span>
                                <span className="font-extrabold text-right text-gray-200">{movie.release_date || movie.details?.ReleaseDate || 'TBA'}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-4">
                                <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Budget</span>
                                <span className="font-extrabold text-right text-gray-200">{movie.budget ? `$${movie.budget.toLocaleString()}` : (movie.details?.Budget || 'N/A')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Revenue</span>
                                <span className="font-extrabold text-right text-netflix-red">{movie.revenue ? `$${movie.revenue.toLocaleString()}` : (movie.details?.Revenue || 'N/A')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Keywords mapping */}
                    {(movie.keywords?.keywords || movie.keywords || []).length > 0 && (
                        <div className="bg-[#111] p-8 rounded-xl border border-white/5 shadow-2xl">
                            <h3 className="text-xs font-black text-gray-500 tracking-[0.2em] mb-6 uppercase">Keywords</h3>
                            <div className="flex flex-wrap gap-2">
                                {(movie.keywords?.keywords || movie.keywords || []).slice(0, 10).map((k, idx) => (
                                    <span key={idx} className="bg-white/5 text-gray-400 text-[9px] font-black px-3 py-1.5 rounded-sm border border-white/5 uppercase tracking-tighter hover:text-white transition cursor-default">
                                        {k.name || k}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
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

export default MovieDetails;
