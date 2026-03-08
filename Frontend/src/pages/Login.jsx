import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const result = await login(email, password);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.error || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative w-full h-screen bg-[#111] overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-900/40 via-transparent to-transparent z-0"></div>

            {/* Main Login Card */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
                <div className="bg-[#181818] p-10 md:p-14 rounded-lg w-full max-w-md shadow-2xl border border-gray-800/60">
                    <h1 className="text-3xl font-bold mb-8 text-white">Sign In</h1>

                    {error && <div className="bg-red-500/10 border border-netflix-red text-white p-3 rounded mb-6 text-sm">{error}</div>}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div>
                            <input
                                type="email"
                                placeholder="Email or mobile number"
                                className="w-full bg-[#333] text-white px-4 py-3 rounded outline-none focus:ring-2 focus:ring-netflix-red focus:bg-[#444] transition-colors placeholder-gray-400"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full bg-[#333] text-white px-4 py-3 rounded outline-none focus:ring-2 focus:ring-netflix-red focus:bg-[#444] transition-colors placeholder-gray-400"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-netflix-red text-white font-bold py-3 rounded mt-4 hover:bg-red-700 transition disabled:opacity-50"
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>

                        <div className="flex justify-between items-center text-sm text-gray-400 mt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 accent-gray-500 bg-[#333] border-none" />
                                Remember me
                            </label>
                            <a href="#" className="hover:underline">Need help?</a>
                        </div>
                    </form>

                    <div className="mt-12 text-gray-400 text-sm">
                        <p className="mb-2 text-base">
                            New to CineStream?{' '}
                            <Link to="/signup" className="text-white hover:underline font-medium">
                                Sign up now.
                            </Link>
                        </p>
                        <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                            This page is protected by Google reCAPTCHA to ensure you're not a bot.{' '}
                            <a href="#" className="text-blue-500 hover:underline">Learn more.</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
