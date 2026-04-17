"use client";
import { useEffect, useState, useCallback } from "react";
import axiosInstance from "@/lib/axios";
import { Search, Mail, Loader2, ShieldCheck, User as UserIcon, Filter } from "lucide-react";
import Swal from "sweetalert2";

export default function UserManagement() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterRole, setFilterRole] = useState("ALL");

    const fetchUsers = useCallback(async (isInitial = false) => {
        if (isInitial) setLoading(true);
        else setIsRefreshing(true);
        try {
            const res = await axiosInstance.get("/users");
            setUsers(res.data.data);
        } catch (err) {
            console.error("Error fetching users", err);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers(true);
    }, [fetchUsers]);

    const handleRoleUpdate = async (userId: string, currentRole: string) => {
        const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
        const previousUsers = [...users];
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));

        try {
            await axiosInstance.patch(`/users/${userId}`, { role: newRole });
            const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
            Toast.fire({ icon: 'success', title: `Role escalated to ${newRole}` });
        } catch (err) {
            setUsers(previousUsers);
            Swal.fire('Error', 'Authorization update failed', 'error');
        }
    };

    const handleStatusToggle = async (userId: string, currentStatus: string) => {
        const normalizedStatus = currentStatus ? currentStatus.toLowerCase() : 'active';
        const newStatus = normalizedStatus === "active" ? "blocked" : "active";

        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));

        try {
            await axiosInstance.patch(`/users/${userId}/status`, { status: newStatus });
            const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 1500 });
            Toast.fire({ icon: 'success', title: `User ${newStatus === 'active' ? 'Unblocked' : 'Blocked'}` });
        } catch (err) {
            fetchUsers();
            Swal.fire('Error', 'Could not update status', 'error');
        }
    };

    const filteredUsers = users?.filter((user: any) => {
        const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = filterRole === "ALL" || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    if (loading) return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-indigo-900/20 font-black tracking-tighter">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
            <span className="animate-pulse">SYNCHRONIZING DATABASE...</span>
        </div>
    );

    return (
        <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* --- Header & Search Section --- */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                        User <span className="text-indigo-600">Management</span>
                    </h1>
                    <p className="text-gray-500 font-bold text-sm mt-1 uppercase tracking-widest opacity-60">
                        Access Control & Permissions
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative group w-full sm:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Find citizen..."
                            className="pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 w-full font-bold text-sm shadow-xl shadow-gray-100/50 transition-all"
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <select
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="bg-white border border-gray-100 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-500 outline-none focus:ring-4 focus:ring-indigo-500/5 shadow-xl shadow-gray-100/50 cursor-pointer"
                    >
                        <option value="ALL">All Roles</option>
                        <option value="ADMIN">Admin Only</option>
                        <option value="USER">Standard Users</option>
                    </select>
                </div>
            </div>

            {/* --- Table Container (Desktop) --- */}
            <div className="hidden md:block bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-2xl shadow-indigo-100/20 overflow-hidden relative">
                {isRefreshing && (
                    <div className="absolute top-6 right-10 flex items-center gap-2">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">Updating...</span>
                        <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                    </div>
                )}
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-10 py-7 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Identify</th>
                            <th className="px-10 py-7 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Clearance Level</th>
                            <th className="px-10 py-7 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Access Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50/50">
                        {filteredUsers.map((user: any) => {
                            const isActive = user.status?.toLowerCase() === 'active';
                            return (
                                <tr key={user.id} className="hover:bg-indigo-50/30 transition-all group">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-fuchsia-600 rounded-[1.2rem] flex items-center justify-center text-white text-xl font-black shadow-lg shadow-indigo-200 group-hover:rotate-6 transition-transform">
                                                {user.name ? user.name[0] : <UserIcon size={20} />}
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 text-lg tracking-tight leading-none mb-1.5">{user.name}</p>
                                                <p className="text-xs text-gray-400 font-bold flex items-center gap-1.5"><Mail className="w-3 h-3 text-indigo-300" /> {user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <button
                                            onClick={() => handleRoleUpdate(user.id, user.role)}
                                            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${user.role === 'ADMIN'
                                                ? 'bg-indigo-600 text-white shadow-indigo-100'
                                                : 'bg-white border border-gray-100 text-gray-500 hover:border-indigo-200'
                                                }`}
                                        >
                                            {user.role === 'ADMIN' ? <ShieldCheck size={14} /> : <UserIcon size={14} />}
                                            {user.role}
                                        </button>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex justify-end items-center gap-4">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-emerald-500' : 'text-rose-400 opacity-60'}`}>
                                                {user.status || 'active'}
                                            </span>
                                            <button
                                                onClick={() => handleStatusToggle(user.id, user.status)}
                                                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-500 ${isActive ? 'bg-emerald-500 shadow-lg shadow-emerald-100' : 'bg-gray-200'}`}
                                            >
                                                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-all duration-500 shadow-sm ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* --- Mobile Card View (Flexible for Small Devices) --- */}
            <div className="md:hidden space-y-4">
                {filteredUsers.map((user: any) => {
                    const isActive = user.status?.toLowerCase() === 'active';
                    return (
                        <div key={user.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col gap-5">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl font-black">
                                    {user.name ? user.name[0] : "U"}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-black text-gray-900 truncate tracking-tight">{user.name}</p>
                                    <p className="text-xs text-gray-400 font-bold truncate">{user.email}</p>
                                </div>
                            </div>

                            <div className="h-[1px] bg-gray-50 w-full" />

                            <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Permissions</span>
                                    <button
                                        onClick={() => handleRoleUpdate(user.id, user.role)}
                                        className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tighter ${user.role === 'ADMIN' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}
                                    >
                                        {user.role}
                                    </button>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Account Status</span>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[10px] font-black uppercase ${isActive ? 'text-emerald-500' : 'text-rose-400'}`}>{user.status || 'active'}</span>
                                        <button
                                            onClick={() => handleStatusToggle(user.id, user.status)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${isActive ? 'bg-emerald-500' : 'bg-gray-200'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}