import { NavLink, useNavigate } from 'react-router-dom'

export default function Sidebar({ portal }) {
  const navigate = useNavigate()

  const MENUS = {
    hr: [
      {
        title: 'Admin',
        items: [
          { to: '/hr/view-requests', label: 'View Requests', icon: '📄' },
          { to: '/hr/user-management', label: 'User Management', icon: '👤' },
          { to: '/hr/attendance-admin', label: 'Attendance Admin', icon: '🗓️' },
        ],
      },
      {
        title: 'Operations',
        items: [
          { to: '/hr/training', label: 'Training Management', icon: '🎓' },
          { to: '/hr/department-analytics', label: 'Department Analytics', icon: '📊' },
          { to: '/hr/notifications', label: 'Notifications', icon: '🔔' },
          { to: '/hr/announcements', label: 'Announcements', icon: '📣' },
          { to: '/hr/project-listing', label: 'Project Listing', icon: '🗂️' },
          { to: '/hr/production-area', label: 'Production Area', icon: '🏭' },
        ],
      },
    ],
    'event': [
      {
        title: 'Event',
        items: [
          { to: '/event/dashboard', label: 'Dashboard', icon: '🏠' },
          { to: '/event/events', label: 'Events', icon: '🎟️' },
          { to: '/event/registrations', label: 'Registrations', icon: '📝' },
          { to: '/event/schedule', label: 'Schedule', icon: '🗓️' },
          { to: '/event/venues', label: 'Venues', icon: '📍' },
          { to: '/event/sponsors', label: 'Sponsors', icon: '🤝' },
          { to: '/event/volunteers', label: 'Volunteers', icon: '🧑‍🤝‍🧑' },
          { to: '/event/feedback', label: 'Feedback', icon: '💬' },
          { to: '/event/analytics', label: 'Analytics', icon: '📊' },
        ],
      },
    ],
    'transport-hr': [
      {
        title: 'Transport HR',
        items: [
          { to: '/transport-hr/dashboard', label: 'Dashboard', icon: '🏠' },
          { to: '/transport-hr/drivers', label: 'Drivers', icon: '🧑‍✈️' },
          { to: '/transport-hr/vehicles', label: 'Vehicles', icon: '🚐' },
          { to: '/transport-hr/routes', label: 'Routes', icon: '🗺️' },
          { to: '/transport-hr/attendance-admin', label: 'Attendance Admin', icon: '🗓️' },
          { to: '/transport-hr/view-requests', label: 'Requests', icon: '📄' },
        ],
      },
    ],
    finance: [
      {
        title: 'Finance',
        items: [
          { to: '/finance/dashboard', label: 'Dashboard', icon: '🏠' },
          { to: '/finance/budget', label: 'Budget Overview', icon: '💰' },
          { to: '/finance/approvals', label: 'Approvals', icon: '✅' },
          { to: '/finance/invoices', label: 'Invoices', icon: '🧾' },
          { to: '/finance/expenses', label: 'Expenses', icon: '💳' },
          { to: '/finance/payroll', label: 'Payroll', icon: '🪙' },
          { to: '/finance/reports', label: 'Reports', icon: '📄' },
          { to: '/finance/vendors', label: 'Vendors', icon: '🏷️' },
          { to: '/finance/purchase-orders', label: 'Purchase Orders', icon: '📦' },
        ],
      },
    ],
  }

  const sections = MENUS[portal] ?? []

  const onLogout = () => {
    try {
      localStorage.removeItem('session')
    } catch {}
    navigate('/')
  }

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo">SMG</div>
        <div>
          <div>SMG Scooters</div>
          <small style={{opacity:0.8}}>Admin Portal</small>
        </div>
      </div>

      {sections.map(section => (
        <div key={section.title}>
          <div className="section-title">{section.title}</div>
          {section.items.map(it => (
            <NavLink key={it.to} to={it.to} className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
              <span>{it.icon}</span>
              <span>{it.label}</span>
            </NavLink>
          ))}
        </div>
      ))}

      <div className="spacer" />
      <button onClick={onLogout} className="signout nav-item" style={{border:'none', background:'transparent', textAlign:'left'}}>↪ Sign Out</button>
    </aside>
  )
}
