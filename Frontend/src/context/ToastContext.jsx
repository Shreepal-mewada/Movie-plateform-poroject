import { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 3000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-10 right-10 z-[100] flex flex-col gap-4 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`
                            pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] 
                            border border-white/10 backdrop-blur-2xl transition-all duration-500 animate-in slide-in-from-right-10 fade-in
                            ${toast.type === 'success' ? 'bg-netflix-red/90 text-white' : 'bg-gray-900/95 text-white'}
                        `}
                    >
                        {toast.type === 'success' ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                        ) : toast.type === 'error' ? (
                            <AlertCircle className="w-5 h-5 text-red-500" />
                        ) : (
                            <Info className="w-5 h-5 text-blue-500" />
                        )}
                        <p className="font-black uppercase tracking-tighter text-sm whitespace-nowrap">
                            {toast.message}
                        </p>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="ml-4 hover:scale-110 transition-transform cursor-pointer"
                        >
                            <X className="w-4 h-4 text-white/60" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
