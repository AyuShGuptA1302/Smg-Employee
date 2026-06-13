import React from 'react';
import { DepartmentLoginWrapper } from '../../components/DepartmentLoginWrapper';
import { DepartmentSidebar } from '../../components/DepartmentSidebar';

/**
 * DepartmentSelector – The main entry point for the department portal.
 * Shows the department sidebar with all departments as royal‑blue boxes.
 * Each department has its own login flow handled when navigating to that route.
 */
export default function DepartmentSelector() {
    return (
        <div className="min-h-screen bg-[#F4F7FE] flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-[#0B4DA2]">SMG Department Portal</h1>
                <p className="text-sm text-gray-500 mt-1">Select a department to access its dashboard</p>
            </header>

            {/* Department Grid */}
            <main className="flex-1 p-8">
                <h2 className="text-xl font-bold text-[#1B254B] mb-6">Available Departments</h2>
                <DepartmentSidebar />
            </main>
        </div>
    );
}

export { DepartmentLoginWrapper };
