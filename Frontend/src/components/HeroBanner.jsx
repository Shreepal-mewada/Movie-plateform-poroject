import React from 'react';
import { Play, Info } from 'lucide-react';

const HeroBanner = ({ movie, onWatchTrailer, onMoreInfo }) => {
    if (!movie) return null;

    const { title, description, backdrop_path, tag } = movie;
    const bgImage = backdrop_path?.startsWith('http')
        ? backdrop_path
        : (backdrop_path
            ? `https://image.tmdb.org/t/p/original${backdrop_path}`
            : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1925&q=80');

    // Added a feature tag for UI richness
    const featureTag = tag || 'FEATURED MOVIE';

    return (
        <div className="relative w-full h-screen text-white flex items-center overflow-hidden">
            {/* Background Image with slight zoom effect and better positioning */}
            <div
                className="absolute top-0 left-0 w-full h-full bg-cover bg-center object-cover scale-105"
                style={{
                    backgroundImage: `url('${bgImage}')`,
                    backgroundPosition: 'center 20%'
                }}
            />

            {/* Gradient Overlays for Cinematic effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-netflix-dark via-netflix-dark/40 to-transparent z-1" />
            <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark via-transparent to-transparent z-1" />

            {/* Content Container */}
            <div className="relative z-10 px-4 sm:px-12 md:px-20 lg:px-24 w-full md:max-w-4xl pt-20">
                <div className="inline-block bg-netflix-red text-white text-[10px] md:text-xs font-black px-2 py-0.5 tracking-widest rounded-sm mb-4">
                    {featureTag}
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-4 md:mb-6 drop-shadow-2xl tracking-tighter leading-[0.9]">
                    {title || "The Midnight Horizon"}
                </h1>

                <p className="text-sm sm:text-base md:text-xl text-gray-200 mb-6 md:mb-10 max-w-2xl drop-shadow-md line-clamp-3 leading-relaxed font-medium">
                    {description || "A pulse-pounding thriller set in the neon-lit streets of 2049. A rogue operative uncovers a conspiracy that threatens to rewrite human history."}
                </p>

                <div className="flex flex-wrap gap-3 md:gap-4">
                    <button
                        onClick={() => onWatchTrailer && onWatchTrailer(movie)}
                        className="flex items-center gap-2 md:gap-3 bg-netflix-red text-white px-5 md:px-8 py-2.5 md:py-3.5 rounded-md hover:bg-red-700 transition-all duration-300 font-bold shadow-xl active:scale-95"
                    >
                        <Play className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                        <span className="text-base md:text-lg">Watch Trailer</span>
                    </button>

                    <button
                        onClick={() => onMoreInfo && onMoreInfo(movie)}
                        className="flex items-center gap-2 md:gap-3 bg-netflix-gray/30 text-white px-5 md:px-8 py-2.5 md:py-3.5 rounded-md hover:bg-netflix-gray/50 transition-all duration-300 font-bold backdrop-blur-md border border-white/10 active:scale-95"
                    >
                        <Info className="w-5 h-5 md:w-6 md:h-6" />
                        <span className="text-base md:text-lg">More Info</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HeroBanner;
