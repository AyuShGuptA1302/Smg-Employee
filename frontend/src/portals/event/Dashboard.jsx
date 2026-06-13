import Layout from '../Layout'
import StatCard from '../StatCard'

export default function EventDashboard() {
  return (
    <Layout portal="event">
      <div className="hero">
        <div className="title">Event · Overview</div>
      </div>
      <div style={{ marginTop: 16 }} className="grid cols-3">
        <StatCard title="Upcoming Events" value="3" />
        <StatCard title="Open Registrations" value="2" />
        <StatCard title="Attendees" value="245" />
      </div>
    </Layout>
  )
}
