import React, { useState, useEffect } from 'react';
import { Search, Bell, Plus, Users, ShieldAlert, UserCheck, UserX, Edit3, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const mockUsers = [
    { _id: '1', name: 'Alex Johnson', email: 'alex@example.com', role: 'ADMIN', isBanned: false, createdAt: new Date().toISOString() },
];

const UsersManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/users');
            if (res.data && res.data.success) {
                const data = res.data.data;
                setUsers(Array.isArray(data) ? data : (data.results || []));
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
            setUsers(mockUsers);
            addToast('Using mock data - backend connection failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleBan = async (user) => {
        try {
            const res = await api.put(`/users/ban/${user._id}`);
            if (res.data.success) {
                addToast(res.data.message, 'success');
                // Optimistic update
                setUsers(users.map(u => u._id === user._id ? { ...u, isBanned: !u.isBanned } : u));
            }
        } catch (error) {
            addToast(error.response?.data?.message || 'Action failed', 'error');
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

        try {
            const res = await api.delete(`/users/${id}`);
            if (res.data.success) {
                addToast('User deleted successfully', 'success');
                setUsers(users.filter(u => u._id !== id));
            }
        } catch (error) {
            addToast(error.response?.data?.message || 'Delete failed', 'error');
        }
    };

    return (
        <div className="flex flex-col h-full overflow-hidden bg-[#0f0f13]">

            {/* Top Header */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between px-8 py-5 border-b border-[#222] bg-[#141418]">
                <div className="relative w-full sm:w-96 mb-4 sm:mb-0">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search users, emails, or roles..."
                        className="bg-[#1a1a20] border border-[#2a2a30] text-sm text-white rounded-full pl-11 pr-4 py-2.5 w-full focus:outline-none focus:border-gray-500 transition-colors placeholder-gray-500"
                    />
                </div>

                <div className="flex items-center justify-end gap-6 self-end sm:self-auto">
                    <button className="text-gray-400 hover:text-white transition relative">
                        <Bell className="w-5 h-5 fill-current" />
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-2 border-[#141418] bg-netflix-red rounded-full"></span>
                    </button>
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-sm font-bold border border-gray-600 cursor-pointer text-gray-300">A</div>
                </div>
            </header>

            {/* Main Content Body */}
            <div className="flex-1 overflow-auto p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">User Management</h1>
                        <p className="text-gray-400 text-sm">Audit, edit, and control system user access and roles.</p>
                    </div>

                    <button className="flex items-center justify-center gap-2 bg-netflix-red text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/20 transition self-start md:self-auto shrink-0">
                        <Plus className="w-4 h-4" /> Add New User
                    </button>
                </div>

                {/* Stat Cards Simplified for logic */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: 'TOTAL USERS', value: users.length, icon: Users, color: 'text-blue-500' },
                        { label: 'BANNED', value: users.filter(u => u.isBanned).length, icon: UserX, color: 'text-netflix-red' },
                        { label: 'ADMINS', value: users.filter(u => u.role?.toLowerCase() === 'admin').length, icon: ShieldAlert, color: 'text-yellow-500' },
                        { label: 'ACTIVE NOW', value: Math.max(0, users.length - users.filter(u => u.isBanned).length), icon: UserCheck, color: 'text-green-500' },
                    ].map((s) => (
                        <div key={s.label} className="bg-[#141418] border border-[#222] rounded-xl p-5 hover:border-gray-700 transition cursor-default">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-2 rounded-lg bg-gray-800/50 ${s.color}`}><s.icon className="w-5 h-5 fill-current" /></div>
                            </div>
                            <p className="text-xs font-bold text-gray-400 tracking-wider mb-1">{s.label}</p>
                            <h3 className="text-3xl font-bold text-white tracking-tight">{s.value}</h3>
                        </div>
                    ))}
                </div>

                {/* Table */}
                <div className="border border-[#222] rounded-xl overflow-hidden bg-[#141418] shadow-sm">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-[#222] text-[11px] font-bold text-gray-500 uppercase tracking-widest bg-[#1a1a20]">
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#222]">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 animate-pulse uppercase text-xs font-black tracking-widest">Initialising User Table...</td>
                                </tr>
                            ) : users.length > 0 ? users.map(u => (
                                <tr key={u._id} className="hover:bg-[#1a1a20] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full border border-gray-700 bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400">
                                                {u.avatar ? <img src={u.avatar} alt="" className="w-full h-full rounded-full" /> : (u.name?.charAt(0) || 'U')}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-sm mb-0.5">{u.name}</div>
                                                <div className="text-[11px] text-gray-500 font-medium tracking-wide uppercase">JOINED {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-sm ${u.isBanned ? 'text-gray-500 italic' : 'text-gray-300'}`}>{u.email}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${u.role?.toLowerCase() === 'admin' ? 'bg-netflix-red/10 text-netflix-red border-netflix-red/30' :
                                            'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                            }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${!u.isBanned ? 'text-green-500' : 'text-netflix-red'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${!u.isBanned ? 'bg-green-500 animate-pulse' : 'bg-netflix-red'}`}></div>
                                            {u.isBanned ? 'Banned' : 'Active'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition" title="Edit">
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </button>

                                            <button
                                                onClick={() => handleToggleBan(u)}
                                                className={`w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center transition ${u.isBanned ? 'text-green-500 hover:bg-green-500/10' : 'text-netflix-red hover:bg-red-500/10'}`}
                                                title={u.isBanned ? 'Unban User' : 'Ban User'}
                                            >
                                                {u.isBanned ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                                            </button>

                                            <button
                                                onClick={() => handleDeleteUser(u._id)}
                                                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition"
                                                title="Delete User"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 uppercase text-xs font-black tracking-widest">No matching users found in database.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Table Footer */}
                    <div className="bg-[#1a1a20] px-6 py-4 border-t border-[#222] flex items-center justify-between">
                        <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Listing <span className="text-white">{users.length}</span> verified profiles</div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default UsersManager;
