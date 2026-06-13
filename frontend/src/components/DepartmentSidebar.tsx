import React from 'react';
import { Link } from 'react-router-dom';
import {
    Utensils,
    Calendar,
    DollarSign,
    Home,
    Users,
    Bell,
    Smartphone,
    Clock,
    Bus,
    Shirt,
} from 'lucide-react';

interface Department {
    id: string;
    label: string;
    path: string;
    icon: React.ReactNode;
}

const departments: Department[] = [
    { id: 'canteen', label: 'Canteen', path: '/departments/canteen', icon: <Utensils size={24} /> },
    { id: 'events', label: 'Events', path: '/departments/events', icon: <Calendar size={24} /> },
    { id: 'finance', label: 'Finance', path: '/departments/finance', icon: <DollarSign size={24} /> },
    { id: 'guesthouse', label: 'Guesthouse', path: '/departments/guesthouse', icon: <Home size={24} /> },
    { id: 'hr', label: 'HR', path: '/departments/hr', icon: <Users size={24} /> },
    { id: 'reception', label: 'Reception', path: '/departments/reception', icon: <Bell size={24} /> },
    { id: 'sim', label: 'Sim', path: '/departments/sim', icon: <Smartphone size={24} /> },
    { id: 'timeoffice', label: 'Time Office', path: '/departments/timeoffice', icon: <Clock size={24} /> },
    { id: 'transport', label: 'Transport', path: '/departments/transport', icon: <Bus size={24} /> },
    { id: 'uniform', label: 'Uniform', path: '/departments/uniform', icon: <Shirt size={24} /> },
];

/**
 * DepartmentSidebar – displays royal‑blue boxes for each department.
 * Each box links to that department's login page.
 */
export function DepartmentSidebar() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-6">
            {departments.map((dept) => (
                <Link
                    key={dept.id}
                    to={dept.path}
                    className="bg-[#0B4DA2] hover:bg-[#0A3C8A] text-white rounded-xl p-4 flex flex-col items-center justify-center transition-colors shadow-lg gap-2"
                >
                    {dept.icon}
                    <span className="text-sm font-semibold">{dept.label}</span>
                </Link>
            ))}
        </div>
    );
}

export default DepartmentSidebar;
