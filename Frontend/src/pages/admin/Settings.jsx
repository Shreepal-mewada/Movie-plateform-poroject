import React from 'react';
import { Settings as SettingsIcon, Shield, Bell, User, Database, Globe } from 'lucide-react';

const Settings = () => {
    const sections = [
        { name: 'General', icon: Globe, desc: 'Update platform brand and default settings.' },
        { name: 'Security', icon: Shield, desc: 'Manage API keys and authentication rules.' },
        { name: 'Notifications', icon: Bell, desc: 'Configure system alerts and emails.' },
        { name: 'Admin Profile', icon: User, desc: 'Change your personal admin credentials.' },
        { name: 'Database', icon: Database, desc: 'System backup and maintenance tools.' },
    ];

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8 tracking-tight">System Settings</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {sections.map((section) => (
                    <div key={section.name} className="flex items-center gap-6 p-6 bg-[#111] border border-[#222] rounded-xl hover:bg-[#1a1a1a] transition cursor-pointer group">
                        <div className="p-4 bg-gray-800/80 rounded-xl group-hover:bg-netflix-red/10 transition-colors">
                            <section.icon className="w-6 h-6 text-gray-400 group-hover:text-netflix-red transition-colors" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-1">{section.name}</h3>
                            <p className="text-sm text-gray-500">{section.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 p-8 border-t border-[#222] flex items-center justify-between bg-netflix-red/5 rounded-b-xl border-x border-b">
                <div>
                    <h4 className="font-bold text-netflix-red uppercase text-xs tracking-widest mb-1">Configuration Lock</h4>
                    <p className="text-sm text-gray-400">Some settings are currently locked and managed via environment variables.</p>
                </div>
                <button className="bg-[#111] border border-[#333] px-6 py-2.5 rounded-full text-xs font-black hover:border-gray-500 transition uppercase tracking-widest">
                    Unlock System
                </button>
            </div>
        </div>
    );
};

export default Settings;
