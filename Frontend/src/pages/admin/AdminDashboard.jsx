import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Clapperboard, LayoutDashboard, Film, Users, BarChart3, Settings, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const navItems = [
        { name: 'Overview', icon: LayoutDashboard, path: '/admin' },
        { name: 'Movie Management', icon: Film, path: '/admin/movies' },
        { name: 'User Management', icon: Users, path: '/admin/users' },
        { name: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
        { name: 'Settings', icon: Settings, path: '/admin/settings' },
    ];

    const toggleSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);

    return (
        <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden relative">

            {/* Mobile Sidebar Overlay */}
            {isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden"
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 w-64 bg-[#111] border-r border-[#222] flex flex-col justify-between z-[100] transition-transform duration-300 lg:relative lg:translate-x-0
                ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex flex-col h-full">
                    <div className="p-6 pb-8 border-b border-[#222] mb-4 flex items-center justify-between">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="bg-netflix-red p-1.5 rounded-full">
                                    <img src="https://static.thenounproject.com/png/77640-200.png" alt="Logo" className="w-5 h-5 invert" />
                                </div>
                                <h2 className="text-xl font-bold tracking-tight text-netflix-red">SpiderScope</h2>
                            </div>
                            <p className="text-xs text-gray-500 font-medium pl-10">Movie Control Center</p>
                        </div>
                        <button onClick={() => setIsMobileSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <nav className="flex-1 space-y-1 px-4 overflow-y-auto">
                        {navItems.map(item => {
                            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                            return (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => setIsMobileSidebarOpen(false)}
                                    className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${isActive
                                        ? 'bg-netflix-red/10 text-netflix-red border border-netflix-red/30 shadow-[0_0_20px_rgba(229,9,20,0.1)]'
                                        : 'text-gray-500 hover:text-white hover:bg-[#1a1a1a]'
                                        }`}
                                >
                                    <item.icon className={`w-5 h-5 ${isActive ? 'text-netflix-red' : ''}`} />
                                    {item.name}
                                </NavLink>
                            );
                        })}
                    </nav>

                    {/* Bottom User Profile */}
                    <div className="p-4 border-t border-[#222] bg-[#0d0d0d]">
                        <button onClick={logout} className="w-full flex items-center justify-between p-3 hover:bg-[#1a1a1a] rounded-xl transition-all group border border-transparent hover:border-[#333]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full border border-gray-700 overflow-hidden bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400">
                                    {user?.name?.charAt(0) || 'A'}
                                </div>
                                <div>
                                    <p className="text-sm font-black text-white leading-tight uppercase tracking-tighter">{user?.name || 'Admin'}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{user?.role || 'SYSTEM'}</p>
                                </div>
                            </div>
                            <LogOut className="w-4 h-4 text-gray-600 group-hover:text-netflix-red transition-colors" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0a0a0a]">
                {/* Mobile Header Toggle */}
                <div className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-[#222] bg-[#111]">
                    <div className="flex items-center gap-3">
                        <img src="https://static.thenounproject.com/png/77640-200.png" alt="Logo" className="w-6 h-6 invert sepia-[1] saturate-[100] hue-rotate-[0deg]" />
                        <span className="text-netflix-red font-black tracking-tighter uppercase">SpiderScope</span>
                    </div>
                    <button onClick={toggleSidebar} className="p-2 bg-[#1a1a1a] rounded-lg border border-[#333] text-gray-400">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-auto">
                    <Outlet />
                </div>
            </main>

        </div>
    );
};

export default AdminDashboard;
