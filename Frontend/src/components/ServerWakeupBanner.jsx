import React, { useEffect } from 'react';
import { useServerStatus } from '../context/ServerStatusContext';
import { Coffee, Zap, RefreshCw } from 'lucide-react';

const ServerWakeupBanner = () => {
    const { isWakingUp } = useServerStatus();

    useEffect(() => {
        if (!isWakingUp) return;

        const checkServer = async () => {
            try {
                // Poll backend without Axios interceptors
                const url = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const res = await fetch(`${url}/movies/trending`);
                if (res.ok) {
                    window.location.reload();
                }
            } catch (error) {
                // Ignore fetch errors, server is still sleeping
            }
        };

        // Check every 5 seconds
        const intervalId = setInterval(checkServer, 5000);
        return () => clearInterval(intervalId);
    }, [isWakingUp]);

    if (!isWakingUp) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-500">
            <div className="bg-netflix-dark/90 border border-white/10 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center space-y-6 transform animate-in zoom-in-95 duration-300">
                <div className="relative inline-block">
                    <div className="w-20 h-20 bg-netflix-red/10 rounded-full flex items-center justify-center mx-auto border border-netflix-red/30">
                        <Coffee className="w-10 h-10 text-netflix-red animate-bounce" />
                    </div>
                    <Zap className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
                </div>

                <div className="space-y-3">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">
                        Waking up the server...
                    </h3>
                    <p className="text-gray-400 text-sm font-medium leading-relaxed">
                        Please wait for <strong className="text-white">20-40 seconds</strong> for the backend to start up from sleep mode.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-netflix-red text-xs font-bold uppercase tracking-widest mt-4">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Auto-refreshing when ready
                    </div>
                </div>

                <div className="pt-4">
                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-netflix-red h-full w-2/3 animate-[loading_2s_ease-in-out_infinite] rounded-full"></div>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-3 font-bold uppercase tracking-widest">
                        Establishing secure connection
                    </p>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes loading {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
            `}} />
        </div>
    );
};

export default ServerWakeupBanner;
