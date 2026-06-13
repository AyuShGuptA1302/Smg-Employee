import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface DepartmentLoginWrapperProps {
    departmentName: string;
    children: React.ReactNode;
}

/**
 * Generic wrapper that displays a login form for a department.
 * After successful authentication, it renders the wrapped department dashboard.
 */
export function DepartmentLoginWrapper({ departmentName, children }: DepartmentLoginWrapperProps) {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loginId, setLoginId] = useState('');
    const [loginPwd, setLoginPwd] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (loginId.trim() && loginPwd.trim()) {
            // Authenticate via department credentials
            setLoggedIn(true);
        } else {
            alert('Please enter both ID and password');
        }
    };

    if (loggedIn) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-[#F4F7FE] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-[#0B4DA2] mb-6">
                    {departmentName} Login
                </h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                        <input
                            type="text"
                            value={loginId}
                            onChange={(e) => setLoginId(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B4DA2]"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={loginPwd}
                            onChange={(e) => setLoginPwd(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B4DA2]"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#0B4DA2] hover:bg-[#0A3C8A] text-white font-bold py-2 rounded-xl transition-colors"
                    >
                        Sign In
                    </button>
                </form>
                <a
                    href="/"
                    className="mt-4 w-full flex items-center justify-center text-sm text-gray-600 hover:underline"
                >
                    <ArrowLeft className="mr-1" size={16} /> Back to Dashboard
                </a>
            </div>
        </div>
    );
}

export default DepartmentLoginWrapper;
