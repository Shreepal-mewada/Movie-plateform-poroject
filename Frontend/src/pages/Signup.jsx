import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Lock, Eye, EyeOff, ShieldCheck, X } from 'lucide-react';

const Signup = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreed, setAgreed] = useState(false);

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!agreed) {
            setError('Please agree to the Terms and Privacy Policy');
            return;
        }

        setIsLoading(true);
        try {
            const result = await signup(email, password, fullName);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.error || 'Signup failed. Please try again.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#0a0a0a] flex flex-col items-center justify-center p-4 selection:bg-netflix-red selection:text-white pt-20">
            {/* Header Content */}
            <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">Create Account</h1>
                <p className="text-gray-400 text-lg">Join thousands of movie enthusiasts today.</p>
            </div>

            {/* Signup Card */}
            <div className="w-full max-w-xl bg-[#111] border border-white/5 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                <div className="p-8 md:p-12">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-lg mb-8 text-sm flex items-center gap-3">
                            <X className="w-5 h-5 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300 ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-netflix-red transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    className="w-full bg-[#1a1a1a] border border-white/10 text-white pl-12 pr-4 py-4 rounded-xl outline-none focus:border-netflix-red/50 focus:ring-4 focus:ring-netflix-red/10 transition-all font-medium placeholder-gray-600"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Address */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-netflix-red transition-colors" />
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="w-full bg-[#1a1a1a] border border-white/10 text-white pl-12 pr-4 py-4 rounded-xl outline-none focus:border-netflix-red/50 focus:ring-4 focus:ring-netflix-red/10 transition-all font-medium placeholder-gray-600"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-300 ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-netflix-red transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="w-full bg-[#1a1a1a] border border-white/10 text-white pl-12 pr-12 py-4 rounded-xl outline-none focus:border-netflix-red/50 focus:ring-4 focus:ring-netflix-red/10 transition-all font-medium placeholder-gray-600"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-300 ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-netflix-red transition-colors" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="w-full bg-[#1a1a1a] border border-white/10 text-white pl-12 pr-12 py-4 rounded-xl outline-none focus:border-netflix-red/50 focus:ring-4 focus:ring-netflix-red/10 transition-all font-medium placeholder-gray-600"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Terms and Privacy */}
                        <div className="flex items-start gap-3 ml-1 py-2">
                            <input
                                type="checkbox"
                                id="terms"
                                className="mt-1 w-5 h-5 rounded border-gray-700 bg-gray-800 text-netflix-red focus:ring-netflix-red transition-all cursor-pointer"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                            />
                            <label htmlFor="terms" className="text-sm text-gray-400 leading-tight select-none cursor-pointer">
                                By clicking Sign Up, you agree to our <span className="text-netflix-red font-bold hover:underline">Terms of Service</span> and <span className="text-netflix-red font-bold hover:underline">Privacy Policy</span>.
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-netflix-red text-white font-black py-4 rounded-xl mt-4 hover:bg-red-700 hover:shadow-2xl hover:shadow-netflix-red/20 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-lg uppercase tracking-wider"
                        >
                            {isLoading ? 'Creating My Account...' : 'Create My Account'}
                        </button>
                    </form>

                    {/* Social Auth */}
                    <div className="mt-10">
                        <div className="relative flex items-center justify-center mb-8">
                            <div className="w-full border-t border-white/5"></div>
                            <span className="absolute bg-[#111] px-4 text-xs font-black text-gray-500 tracking-[0.2em] uppercase">Or Sign Up With</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-3 bg-[#1a1a1a] border border-white/10 py-3.5 rounded-xl text-sm font-bold text-white hover:bg-white/5 transition-all active:scale-95 shadow-lg">
                                <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                                Google
                            </button>
                            <button className="flex items-center justify-center gap-3 bg-[#1a1a1a] border border-white/10 py-3.5 rounded-xl text-sm font-bold text-white hover:bg-white/5 transition-all active:scale-95 shadow-lg">
                                <img src="https://www.facebook.com/favicon.ico" className="w-4 h-4" alt="Facebook" />
                                Facebook
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Link */}
                <div className="bg-[#161616] py-6 text-center border-t border-white/5">
                    <p className="text-gray-400 font-medium">
                        Already have an account?{' '}
                        <Link to="/login" className="text-netflix-red font-black hover:underline px-1">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>

            {/* Bottom Links */}
            <div className="mt-12 flex gap-8 text-[10px] font-black text-gray-600 tracking-[0.3em] uppercase">
                <a href="#" className="hover:text-gray-400 transition-colors">Help Center</a>
                <a href="#" className="hover:text-gray-400 transition-colors">Privacy</a>
                <a href="#" className="hover:text-gray-400 transition-colors">Cookies</a>
            </div>
        </div>
    );
};

export default Signup;
