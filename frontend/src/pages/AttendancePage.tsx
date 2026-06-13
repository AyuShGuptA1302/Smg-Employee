import { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

interface AttendanceRecord {
    date: string;
    checkIn: string;
    checkOut: string;
    status: 'Present' | 'Absent' | 'Late' | 'Overtime';
    break: string;
    overtime: string;
}

export const AttendancePage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    // Update current time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 60000); // Update every minute

        return () => clearInterval(timer);
    }, []);

    // Format current date and time
    const formatDate = () => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return `${days[currentDate.getDay()]}, ${currentDate.getDate()} ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    };

    const formatTime = () => {
        return currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    // Statistics
    const stats = {
        present: 16,
        absent: 4,
        late: 3,
        overtime: 5,
        totalHours: '07h',
        productiveHours: '06h 30m',
        breakTime: '0h 30m',
        overtimeHours: '35m'
    };

    // Attendance records
    const attendanceRecords: AttendanceRecord[] = [
        { date: '01 Jan 2024', checkIn: '09:00 AM', checkOut: '06:12 PM', status: 'Present', break: '20 Min', overtime: '45 Min' },
        { date: '02 Jan 2024', checkIn: '09:00 AM', checkOut: '06:13 PM', status: 'Present', break: '50 Min', overtime: '33 Min' },
        { date: '03 Jan 2024', checkIn: '09:00 AM', checkOut: '07:15 PM', status: 'Present', break: '03 Min', overtime: '--' },
        { date: '04 Jan 2024', checkIn: '09:00 AM', checkOut: '08:15 PM', status: 'Present', break: '12 Min', overtime: '--' },
        { date: '05 Jan 2024', checkIn: '09:00 AM', checkOut: '06:23 PM', status: 'Present', break: '41 Min', overtime: '50 Min' },
        { date: '06 Jan 2024', checkIn: '09:00 AM', checkOut: '06:45 PM', status: 'Present', break: '30 Min', overtime: '20 Min' },
        { date: '07 Jan 2024', checkIn: '09:00 AM', checkOut: '06:43 PM', status: 'Present', break: '23 Min', overtime: '10 Min' },
        { date: '08 Jan 2024', checkIn: '09:00 AM', checkOut: '09:23 PM', status: 'Absent', break: '10 Min', overtime: '45 Min' },
        { date: '09 Jan 2024', checkIn: '09:00 AM', checkOut: '07:13 PM', status: 'Present', break: '32 Min', overtime: '--' },
        { date: '10 Jan 2024', checkIn: '09:00 AM', checkOut: '09:17 PM', status: 'Present', break: '14 Min', overtime: '--' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Present': return 'text-green-600';
            case 'Absent': return 'text-red-600';
            case 'Late': return 'text-orange-600';
            case 'Overtime': return 'text-blue-600';
            default: return 'text-gray-600';
        }
    };

    // Filter attendance records
    const filteredRecords = attendanceRecords.filter(record => {
        const matchesSearch = record.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.checkIn.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.checkOut.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'All' || record.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
            {/* Gradient Banner */}
            <div className="bg-gradient-to-br from-[#042A5B] to-[#0B4DA2] rounded-[30px] p-8 text-white shadow-xl mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl">
                            <Calendar className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Attendance</h1>
                            <p className="text-white/80 text-sm">{formatDate()}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-4xl font-bold">{formatTime()}</p>
                        <p className="text-white/80 text-sm">Current Time</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Section - Stats */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-[20px] p-4 shadow-lg border-l-4 border-green-500">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <p className="text-xs font-semibold text-gray-500">Present</p>
                            </div>
                            <p className="text-3xl font-bold text-green-600">{stats.present}</p>
                            <p className="text-xs text-gray-500 mt-1">This Week</p>
                        </div>

                        <div className="bg-white rounded-[20px] p-4 shadow-lg border-l-4 border-red-500">
                            <div className="flex items-center gap-2 mb-2">
                                <XCircle className="w-5 h-5 text-red-500" />
                                <p className="text-xs font-semibold text-gray-500">Absent</p>
                            </div>
                            <p className="text-3xl font-bold text-red-600">{stats.absent}</p>
                            <p className="text-xs text-gray-500 mt-1">This Week</p>
                        </div>

                        <div className="bg-white rounded-[20px] p-4 shadow-lg border-l-4 border-orange-500">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-5 h-5 text-orange-500" />
                                <p className="text-xs font-semibold text-gray-500">Late</p>
                            </div>
                            <p className="text-3xl font-bold text-orange-600">{stats.late}</p>
                            <p className="text-xs text-gray-500 mt-1">This Week</p>
                        </div>

                        <div className="bg-white rounded-[20px] p-4 shadow-lg border-l-4 border-blue-500">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-5 h-5 text-blue-500" />
                                <p className="text-xs font-semibold text-gray-500">Overtime</p>
                            </div>
                            <p className="text-3xl font-bold text-blue-600">{stats.overtime}</p>
                            <p className="text-xs text-gray-500 mt-1">This Week</p>
                        </div>
                    </div>

                    {/* Hours Breakdown */}
                    <div className="bg-white rounded-[20px] p-5 shadow-lg">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 font-medium">Total Hours</span>
                                <span className="text-base font-bold text-gray-900">{stats.totalHours}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 font-medium flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    Productive Hours
                                </span>
                                <span className="text-base font-bold text-blue-600">{stats.productiveHours}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 font-medium flex items-center gap-2">
                                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                    Break Time
                                </span>
                                <span className="text-base font-bold text-orange-600">{stats.breakTime}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 font-medium flex items-center gap-2">
                                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                    Overtime
                                </span>
                                <span className="text-base font-bold text-purple-600">{stats.overtimeHours}</span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4">
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden flex">
                                <div className="bg-blue-500 h-3" style={{ width: '60%' }}></div>
                                <div className="bg-orange-500 h-3" style={{ width: '25%' }}></div>
                                <div className="bg-purple-500 h-3" style={{ width: '15%' }}></div>
                            </div>
                            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                                <span>09:00</span>
                                <span>10:00</span>
                                <span>11:00</span>
                                <span>12:00</span>
                                <span>01:00</span>
                                <span>02:00</span>
                                <span>03:00</span>
                                <span>04:00</span>
                                <span>05:00</span>
                                <span>06:00</span>
                            </div>
                            <p className="text-center text-xs text-gray-500 mt-1">Check In → Check Out</p>
                        </div>
                    </div>
                </div>

                {/* Right Section - Attendance Table */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[30px] p-6 shadow-xl h-full">
                        {/* Search Bar */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Attendance Records</h3>
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#0B4DA2] focus:ring-2 focus:ring-[#0B4DA2]/20 outline-none text-sm"
                                />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#0B4DA2] outline-none text-sm bg-white"
                                >
                                    <option>All</option>
                                    <option>Present</option>
                                    <option>Absent</option>
                                    <option>Late</option>
                                    <option>Overtime</option>
                                </select>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-hidden rounded-2xl border-2 border-gray-300 shadow-md">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] text-white">
                                            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider border-r-2 border-white/20">
                                                Date
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider border-r-2 border-white/20">
                                                Check-In
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider border-r-2 border-white/20">
                                                Check-Out
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider border-r-2 border-white/20">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider border-r-2 border-white/20">
                                                Break
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
                                                Overtime
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredRecords.map((record, index) => (
                                            <tr
                                                key={index}
                                                className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                                    }`}
                                            >
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className="text-sm font-medium text-gray-900">{record.date}</span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className="text-sm text-gray-700">{record.checkIn}</span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className="text-sm text-gray-700">{record.checkOut}</span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className={`text-sm font-semibold ${getStatusColor(record.status)}`}>
                                                        {record.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className="text-sm text-gray-700">{record.break}</span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className="text-sm text-gray-700">{record.overtime}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
