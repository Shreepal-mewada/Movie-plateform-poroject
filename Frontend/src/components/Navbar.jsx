import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, X, Clapperboard, LogOut, User, ChevronDown, Mail } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // Hide navbar on admin routes
    if (location.pathname.startsWith('/admin')) {
        return null;
    }

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Movies', path: '/movies' }, // Optional future route
        { name: 'TV Shows', path: '/tv' },   // Optional future route
        { name: 'My List', path: '/favorites' },
    ];

    const handleLogout = () => {
        logout();
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        }
    };

    return (
        <nav
            className={`fixed w-full z-50 transition-colors duration-300 ${isScrolled ? 'bg-netflix-dark shadow-md' : 'bg-gradient-to-b from-black/80 to-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Desktop Links */}
                    <div className="flex items-center gap-15">
                        <Link to="/" className="flex items-center gap-2 text-white font-black text-xl tracking-tighter uppercase">
                            <div className="w-12 h-12 rounded-full bg-transparent p-1.5 flex items-center justify-center overflow-hidden">
                                <img
                                    src="https://static.thenounproject.com/png/77640-200.png"
                                    alt="Logo"
                                    className="w-full h-full object-contain invert object-center"
                                />
                            </div>
                            <span className='text-netflix-red'>SpiderScope</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-netflix-light">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`hover:text-netflix-red transition-colors duration-200 ${location.pathname === link.path ? 'text-white font-semibold' : ''
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {user?.role === 'admin' && (
                                <Link
                                    to="/admin"
                                    className="text-netflix-red hover:text-white transition-colors duration-200"
                                >
                                    Admin Dashboard
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        <form onSubmit={handleSearch} className="relative group">
                            <div className="flex items-center bg-transparent border border-gray-600 rounded-md px-3 py-1 bg-black/40 focus-within:border-white transition-colors">
                                <Search className="w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search movies..."
                                    className="bg-transparent border-none outline-none text-white text-sm px-2 w-48 placeholder-gray-400"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </form>

                        {user ? (
                            <>
                                <button className="text-white hover:text-gray-300">
                                    <Bell className="w-5 h-5 fill-current" />
                                </button>
                                <div className="relative flex items-center gap-2">
                                    <button
                                        onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                        className="flex items-center gap-2 hover:bg-white/10 p-1.5 rounded-lg transition-all duration-200"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center border border-gray-600 overflow-hidden">
                                            <User className="w-5 h-5 text-gray-300" />
                                        </div>
                                        <span className="text-sm font-medium hidden lg:block text-white">{user.name || user.username}</span>
                                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${profileMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {profileMenuOpen && (
                                        <>
                                            {/* Backdrop to close on click outside */}
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setProfileMenuOpen(false)}
                                            ></div>

                                            <div className="absolute top-12 right-0 w-64 bg-netflix-dark border border-white/10 rounded-xl shadow-2xl py-3 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                                                {/* Profile Section */}
                                                <div className="px-4 py-3 border-b border-white/5 mb-2">
                                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">My Account</p>
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-netflix-red/20 flex items-center justify-center">
                                                                <User className="w-3.5 h-3.5 text-netflix-red" />
                                                            </div>
                                                            <span className="text-sm font-bold text-white truncate">{user.name || user.username}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                                                                <Mail className="w-3.5 h-3.5 text-blue-400" />
                                                            </div>
                                                            <span className="text-xs text-gray-400 truncate">{user.email}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => {
                                                        handleLogout();
                                                        setProfileMenuOpen(false);
                                                    }}
                                                    className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 flex flex-row items-center gap-3 transition-colors"
                                                >
                                                    <div className="p-1 rounded-md bg-white/5">
                                                        <LogOut className="w-4 h-4" />
                                                    </div>
                                                    Sign out
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex gap-4 items-center">
                                <Link to="/login" className="text-sm font-medium text-white hover:text-gray-300">Sign In</Link>
                                <Link to="/signup" className="text-sm font-medium bg-netflix-red text-white px-4 py-1.5 rounded-md hover:bg-red-700 transition">Sign Up</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-gray-300 hover:text-white focus:outline-none"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-netflix-dark border-t border-gray-800">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                            >
                                {link.name}
                            </Link>
                        ))}
                        {user?.role === 'admin' && (
                            <Link
                                to="/admin"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-netflix-red block px-3 py-2 rounded-md text-base font-medium"
                            >
                                Admin Dashboard
                            </Link>
                        )}

                        {!user && (
                            <div className="pt-4 border-t border-gray-800 flex flex-col gap-2">
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-white block px-3 py-2">Sign In</Link>
                                <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="text-netflix-red block px-3 py-2 font-bold">Sign Up</Link>
                            </div>
                        )}
                        {user && (
                            <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full text-left text-gray-400 block px-3 py-2 mt-4 border-t border-gray-800">
                                Sign out
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
