import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const TrailerModal = ({ isOpen, onClose, trailerKey }) => {
    useEffect(() => {
        // Prevent scrolling on the body when modal is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup function
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    // Handle missing trailer key
    const videoId = trailerKey;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm">
            <div
                className="absolute top-6 right-6 text-white/70 hover:text-netflix-red cursor-pointer p-2 z-[110] transition-colors"
                onClick={onClose}
            >
                <X className="w-10 h-10" />
            </div>

            <div
                className="relative z-20 w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                onClick={(e) => e.stopPropagation()}
            >
                {videoId ? (
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0&iv_load_policy=3&enablejsapi=1`}
                        title="Movie Trailer"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                    ></iframe>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                        <div className="w-20 h-20 bg-netflix-red/10 rounded-full flex items-center justify-center mb-6">
                            <X className="w-10 h-10 text-netflix-red" />
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 italic">Signal Lost</h3>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">The cinematic trailer for this asset is currently unavailable.</p>
                        <button
                            onClick={onClose}
                            className="mt-8 px-6 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded text-[10px] font-black uppercase tracking-[0.2em] transition"
                        >
                            Return to Catalog
                        </button>
                    </div>
                )}
            </div>

            {/* Click outside to close (handled by background div) */}
            <div className="absolute inset-0 z-10" onClick={onClose} />
        </div>
    );
};

export default TrailerModal;
