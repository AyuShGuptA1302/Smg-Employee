// Centralized mock datasets for all portals

// Transport HR
export const transportDrivers = [
  { id: 'DRV101', name: 'S. Kumar', phone: '+91 98000 11111', status: 'Active' },
  { id: 'DRV102', name: 'A. Singh', phone: '+91 98000 22222', status: 'Active' },
  { id: 'DRV103', name: 'R. Iyer', phone: '+91 98000 33333', status: 'Inactive' },
]

export const transportVehicles = [
  { plate: 'KA-01-1234', model: 'Electric Van', status: 'Available' },
  { plate: 'KA-02-5678', model: 'Shuttle', status: 'In Service' },
  { plate: 'KA-05-4321', model: 'Cargo', status: 'Maintenance' },
]

export const transportRoutes = [
  { id: 'R001', name: 'Factory · Gate A → R&D', distanceKm: 4.5, avgMins: 12 },
  { id: 'R002', name: 'HQ → Production', distanceKm: 9.2, avgMins: 25 },
  { id: 'R003', name: 'Warehouse → HQ', distanceKm: 15.8, avgMins: 37 },
]

// Event
export const eventEvents = [
  { id: 'E001', name: 'Annual Townhall', date: '2026-01-15', location: 'Auditorium', status: 'Upcoming' },
  { id: 'E002', name: 'Safety Training', date: '2025-12-28', location: 'Training Room A', status: 'Open' },
]

export const eventRegistrations = [
  { id: 'REG1001', eventId: 'E002', attendee: 'Priya Verma', email: 'priya.verma@example.com', status: 'Confirmed' },
  { id: 'REG1002', eventId: 'E002', attendee: 'Mohit Gupta', email: 'mohit.g@example.com', status: 'Pending' },
]

export const eventSponsors = [
  { id: 'SP001', name: 'Alpha Corp', tier: 'Gold' },
  { id: 'SP002', name: 'Beta Ltd', tier: 'Silver' },
]

export const eventVenues = [
  { id: 'V001', name: 'Auditorium', capacity: 500 },
  { id: 'V002', name: 'Training Room A', capacity: 60 },
]

export const eventVolunteers = [
  { id: 'VOL01', name: 'Nisha', role: 'Usher' },
  { id: 'VOL02', name: 'Karan', role: 'Logistics' },
]

export const eventFeedback = [
  { id: 'F001', eventId: 'E001', rating: 4, comment: 'Great session!' },
]

export const eventAnalytics = {
  totals: { events: 2, registrations: 2, attendees: 245 },
  byStatus: [
    { status: 'Upcoming', count: 1 },
    { status: 'Open', count: 1 },
  ],
}

export const eventSchedule = [
  { id: 'SCH-001', eventId: 'E001', title: 'Opening Remarks', start: '2026-01-15T09:00:00', end: '2026-01-15T09:30:00' },
  { id: 'SCH-002', eventId: 'E001', title: 'Q&A', start: '2026-01-15T11:00:00', end: '2026-01-15T11:30:00' },
  { id: 'SCH-003', eventId: 'E002', title: 'Safety Basics', start: '2025-12-28T10:00:00', end: '2025-12-28T11:00:00' },
]

// Finance
export const financeBudget = [
  { id: 'BUD-2025', department: 'Operations', allocated: 6500000, spent: 4200000 },
  { id: 'BUD-2025-FIN', department: 'Finance', allocated: 3500000, spent: 1850000 },
]

export const financeExpenses = [
  { id: 'EXP-0001', desc: 'Office supplies', amount: 12000, date: '2025-12-20', status: 'Approved' },
  { id: 'EXP-0002', desc: 'Travel', amount: 54000, date: '2025-12-18', status: 'Pending' },
]

export const financeInvoices = [
  { id: 'INV-1001', vendor: 'Alpha Corp', amount: 230000, due: '2026-01-10', status: 'Open' },
  { id: 'INV-1002', vendor: 'Beta Ltd', amount: 480000, due: '2026-01-05', status: 'Paid' },
]

export const financePayroll = [
  { id: 'PAY-DEC-2025', cycle: 'Dec 2025', employees: 138, total: 7835000, status: 'Processed' },
]

export const financeApprovals = [
  { id: 'APR-001', item: 'Budget Increase - Ops', requester: 'R. Sharma', status: 'Pending' },
]

export const financeReports = [
  { id: 'RPT-001', name: 'Monthly Spend', period: 'Dec 2025' },
]

export const financeVendors = [
  { id: 'VND-ALPHA', name: 'Alpha Corp', category: 'IT' },
  { id: 'VND-BETA', name: 'Beta Ltd', category: 'Logistics' },
]

export const financePurchaseOrders = [
  { id: 'PO-5001', vendor: 'Alpha Corp', amount: 150000, date: '2025-12-01', status: 'Dispatched' },
]

// HR
export const hrUsers = [
  { id: 'EMP1001', name: 'Rajesh Kumar', dept: 'Production', role: 'Senior Operator', contact: '+91 98765 43210', status: 'Active' },
  { id: 'EMP1025', name: 'Priya Sharma', dept: 'Quality Control', role: 'QC Inspector', contact: '+91 98765 43211', status: 'Active' },
  { id: 'EMP1103', name: 'Anil Mehta', dept: 'R&D', role: 'Engineer', contact: '+91 98765 43212', status: 'Inactive' },
]
