import React from 'react';

export const MovieCardSkeleton = () => {
    return (
        <div className="w-full aspect-[2/3] bg-gray-900 rounded-md animate-pulse shadow-lg ring-1 ring-white/5"></div>
    );
};

export const HeroSkeleton = () => {
    return (
        <div className="w-full h-screen bg-netflix-dark animate-pulse relative flex items-center">
            <div className="relative z-10 px-4 sm:px-12 md:px-20 lg:px-24 w-full md:max-w-4xl">
                <div className="h-4 w-24 bg-gray-800 rounded-sm mb-6"></div>
                <div className="h-16 md:h-24 w-3/4 bg-gray-800 rounded-md mb-8"></div>
                <div className="space-y-3 mb-10">
                    <div className="h-4 w-full bg-gray-800 rounded"></div>
                    <div className="h-4 w-5/6 bg-gray-800 rounded"></div>
                    <div className="h-4 w-4/6 bg-gray-800 rounded"></div>
                </div>
                <div className="flex gap-4">
                    <div className="h-12 w-40 bg-gray-800 rounded-md"></div>
                    <div className="h-12 w-40 bg-gray-800 rounded-md"></div>
                </div>
            </div>
        </div>
    );
};

export const DefaultSkeleton = () => (
    <div className="h-4 bg-gray-800 rounded w-full animate-pulse"></div>
);
