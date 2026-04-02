"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import {
    Search, ShieldCheck, Mail, Calendar, Loader2
} from "lucide-react";
import Swal from "sweetalert2";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterRole, setFilterRole] = useState("ALL");

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/users");
            setUsers(res.data.data);
        } catch (err) {
            console.error("Error fetching users", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleUpdate = async (userId: string, currentRole: string) => {
        const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
        Swal.fire({
            title: `Make him ${newRole}?`,
            text: "You are about to change this user's permissions.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            confirmButtonText: 'Yes, Update'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosInstance.patch(`/users/${userId}`, { role: newRole });
                    Swal.fire('Updated!', 'User role has been changed.', 'success');
                    fetchUsers();
                } catch (err) {
                    Swal.fire('Error', 'Action failed', 'error');
                }
            }
        });
    };

    // স্ট্যাটাস টগল লজিক (Toggle Switch এর জন্য)
    const handleStatusToggle = async (userId: string, currentStatus: string) => {
        const newStatus = currentStatus?.toLowerCase() === "active" ? "blocked" : "active";

        try {
            await axiosInstance.patch(`/users/${userId}/status`, { status: newStatus });
            // টগল বাটনের জন্য সুইট অ্যালার্ট না দিলেও চলে, দিলেও ছোট করে দেওয়া যায়
            fetchUsers();
        } catch (err) {
            Swal.fire('Error', 'Failed to update status', 'error');
        }
    };

    const filteredUsers = users?.filter((user: any) => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = filterRole === "ALL" || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    if (loading) return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-gray-400 font-black">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            FETCHING CITIZENS...
        </div>
    );

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-10 px-4 md:px-0">
            {/* Header, Search & Filter Bar আগের মতই থাকবে... */}

            <div className="hidden md:block bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">User Info</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Account Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredUsers.map((user: any) => {
                            const isActive = user.status?.toLowerCase() === 'active';
                            return (
                                <tr key={user.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black">
                                                {user.name ? user.name[0] : "U"}
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-800">{user.name}</p>
                                                <p className="text-sm text-gray-400 flex items-center gap-1"><Mail className="w-3 h-3" /> {user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <button
                                            onClick={() => handleRoleUpdate(user.id, user.role)}
                                            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}
                                        >
                                            {user.role}
                                        </button>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end items-center gap-3">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-emerald-500' : 'text-rose-400'}`}>
                                                {isActive ? 'Active' : 'Blocked'}
                                            </span>
                                            {/* --- আধুনিক টগল বাটন --- */}
                                            <button
                                                onClick={() => handleStatusToggle(user.id, user.status)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none ${isActive ? 'bg-emerald-500 shadow-lg shadow-emerald-100' : 'bg-gray-200'}`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 ${isActive ? 'translate-x-6' : 'translate-x-1'}`}
                                                />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}