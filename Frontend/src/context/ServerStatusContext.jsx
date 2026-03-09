import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { setApiCallbacks } from '../services/api';

const ServerStatusContext = createContext();

export const ServerStatusProvider = ({ children }) => {
    const [isAwake, setIsAwake] = useState(false);
    const [isWakingUp, setIsWakingUp] = useState(false);
    const timeoutRef = useRef(null);

    const markRequestStarted = () => {
        if (isAwake) return;

        if (!timeoutRef.current) {
            timeoutRef.current = setTimeout(() => {
                if (!isAwake) {
                    setIsWakingUp(true);
                }
            }, 4000);
        }
    };

    const markRequestFinished = (success = true) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        if (success) {
            setIsAwake(true);
            setIsWakingUp(false);
        }
    };

    useEffect(() => {
        setApiCallbacks(markRequestStarted, markRequestFinished);
        return () => setApiCallbacks(() => { }, () => { });
    }, [isAwake]); // Re-subscribe when isAwake changes to ensure correct logic

    return (
        <ServerStatusContext.Provider value={{ isAwake, isWakingUp, markRequestStarted, markRequestFinished }}>
            {children}
        </ServerStatusContext.Provider>
    );
};

export const useServerStatus = () => {
    const context = useContext(ServerStatusContext);
    if (!context) {
        throw new Error('useServerStatus must be used within a ServerStatusProvider');
    }
    return context;
};
