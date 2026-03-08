import React from 'react';
import { Clapperboard, Globe, Volume2, AtSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[#050505] text-gray-400 py-16 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-12 lg:px-24">
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-16">
                    {/* Logo and Description */}
                    <div className="md:col-span-2 lg:col-span-3 space-y-6">
                        <div className="flex items-center gap-2 text-white font-black text-xl tracking-tighter uppercase">
                            <div className="bg-netflix-red p-1 rounded-sm">
                                <Clapperboard className="w-6 h-6 fill-current text-white" />
                            </div>
                            <span>MoviePlatform</span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-sm font-medium">
                            The world's premier platform for independent and blockbuster cinema. Experience 4K HDR streaming like never before.
                        </p>
                    </div>

                    {/* Platform Columns */}
                    <div className="space-y-6">
                        <h4 className="text-white font-black text-xs uppercase tracking-widest">Platform</h4>
                        <ul className="space-y-4 text-sm font-bold">
                            <li><Link to="/movies" className="hover:text-netflix-red transition-colors">Browse</Link></li>
                            <li><Link to="#" className="hover:text-netflix-red transition-colors">Pricing</Link></li>
                            <li><Link to="#" className="hover:text-netflix-red transition-colors">Devices</Link></li>
                        </ul>
                    </div>

                    {/* Support Columns */}
                    <div className="space-y-6">
                        <h4 className="text-white font-black text-xs uppercase tracking-widest">Support</h4>
                        <ul className="space-y-4 text-sm font-bold">
                            <li><Link to="#" className="hover:text-netflix-red transition-colors">Help Center</Link></li>
                            <li><Link to="#" className="hover:text-netflix-red transition-colors">Contact</Link></li>
                            <li><Link to="#" className="hover:text-netflix-red transition-colors">Privacy</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[11px] font-bold text-gray-600 uppercase tracking-tighter">
                        © 2024 MoviePlatform Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-gray-600">
                        <button className="hover:text-white transition-colors">
                            <Volume2 className="w-4 h-4" />
                        </button>
                        <button className="hover:text-white transition-colors">
                            <Globe className="w-4 h-4" />
                        </button>
                        <button className="hover:text-white transition-colors">
                            <AtSign className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
