import React from 'react';
import { BarChart3, TrendingUp, Users, Film } from 'lucide-react';

const Analytics = () => {
    const stats = [
        { name: 'Total Views', value: '2.4M', change: '+12%', icon: Users, color: 'text-blue-500' },
        { name: 'Avg. Watch Time', value: '45m', change: '+5%', icon: BarChart3, color: 'text-green-500' },
        { name: 'New Subscriptions', value: '1,204', change: '+18%', icon: TrendingUp, color: 'text-purple-500' },
        { name: 'Library Size', value: '842', change: '+2%', icon: Film, color: 'text-netflix-red' },
    ];

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8 tracking-tight">Analytics Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-[#111] border border-[#222] p-6 rounded-xl hover:border-gray-700 transition-all cursor-default group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 rounded-lg bg-gray-800/50 ${stat.color}`}>
                                <stat.icon className="w-5 h-5 fill-current" />
                            </div>
                            <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded">
                                {stat.change}
                            </span>
                        </div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.name}</p>
                        <h3 className="text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="bg-[#111] border border-[#222] rounded-xl p-8 text-center">
                <div className="inline-flex items-center justify-center p-4 bg-red-500/10 rounded-full mb-4">
                    <BarChart3 className="w-8 h-8 text-netflix-red" />
                </div>
                <h3 className="text-xl font-bold mb-2">Detailed Reports is Coming Soon</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                    We are currently integrating deeper metrics to give you better insights into user behavior and content performance.
                </p>
            </div>
        </div>
    );
};

export default Analytics;
