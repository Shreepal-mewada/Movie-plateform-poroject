import React, { useState, useEffect } from 'react';
import { Users, Film, PlayCircle, Eye, TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';
import api from '../../services/api';

const DashboardOverview = () => {
    const [stats, setStats] = useState({
        users: 0,
        movies: 0,
        views: '1.2k',
        activeNow: 42
    });

    useEffect(() => {
        // Fetch real stats if possible
        const fetchStats = async () => {
            try {
                const [usersRes, moviesRes] = await Promise.all([
                    api.get('/users'),
                    api.get('/movies/trending')
                ]);

                setStats(prev => ({
                    ...prev,
                    users: usersRes.data?.data?.length || 0,
                    movies: moviesRes.data?.data?.results?.length || 0
                }));
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
            }
        };

        fetchStats();
    }, []);

    const cards = [
        { name: 'Total Users', value: stats.users, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { name: 'Movies in Catalog', value: stats.movies, icon: Film, color: 'text-netflix-red', bg: 'bg-netflix-red/10' },
        { name: 'Total Watch Time', value: '428h', icon: PlayCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
        { name: 'Monthly Views', value: stats.views, icon: Eye, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    ];

    return (
        <div className="p-8 pb-16">
            <div className="mb-10">
                <h1 className="text-3xl font-bold tracking-tight mb-2">System Overview</h1>
                <p className="text-gray-400">Welcome back. Here's what's happening with SpiderScope today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {cards.map((card) => (
                    <div key={card.name} className="bg-[#111] border border-[#222] p-6 rounded-2xl hover:border-gray-700 transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                                <card.icon className="w-6 h-6" />
                            </div>
                            <TrendingUp className="w-4 h-4 text-green-500" />
                        </div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{card.name}</p>
                        <h3 className="text-3xl font-bold text-white tracking-tighter">{card.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activities Placeholder */}
                <div className="lg:col-span-2 bg-[#111] border border-[#222] rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold">Recent System Logs</h3>
                        <button className="text-xs text-netflix-red font-bold hover:underline py-1 px-2">View All Logs</button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { action: 'New User Registered', time: '2 mins ago', icon: Users, color: 'text-blue-400' },
                            { action: 'Updated "Interstellar" Metadata', time: '15 mins ago', icon: Film, color: 'text-netflix-red' },
                            { action: 'System Backup Completed', time: '1 hour ago', icon: PlayCircle, color: 'text-green-400' },
                            { action: 'User "JohnDoe" Banned', time: '3 hours ago', icon: Users, color: 'text-netflix-red' },
                        ].map((log, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-[#222] rounded-xl hover:bg-[#1a1a1a] transition">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg bg-gray-800 ${log.color}`}>
                                        <log.icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{log.action}</p>
                                        <p className="text-xs text-gray-500 flex items-center gap-1"><Calendar className="w-3 h-3" /> {log.time}</p>
                                    </div>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-gray-600" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-netflix-red/10 border border-netflix-red/20 rounded-2xl p-6 flex flex-col justify-center text-center">
                    <div className="w-20 h-20 bg-netflix-red rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-netflix-red/20">
                        <Users className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{stats.activeNow} Users</h3>
                    <p className="text-sm text-gray-400 mb-6">Currently interacting with the platform in real-time.</p>
                    <button className="bg-netflix-red text-white py-3 rounded-xl font-bold text-sm tracking-wide shadow-xl shadow-netflix-red/10 hover:bg-red-700 transition">
                        View Live Traffic
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
