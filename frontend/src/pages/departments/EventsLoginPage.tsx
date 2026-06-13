import React from 'react';
import { DepartmentLoginWrapper } from '../../components/DepartmentLoginWrapper';

// Inline simple Events dashboard placeholder until the original EventsPortal is restored
const EventsDashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 p-8">
        <h2 className="text-2xl font-bold text-[#0B4DA2] mb-4">Events Dashboard</h2>
        <p className="text-gray-700">Full Events portal UI will be restored here.</p>
    </div>
);

export default function EventsLoginPage() {
    return (
        <DepartmentLoginWrapper departmentName="Events">
            <EventsDashboard />
        </DepartmentLoginWrapper>
    );
}
