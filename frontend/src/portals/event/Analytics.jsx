import Layout from '../../components/Layout'
import StatCard from '../../components/StatCard'
import { eventAnalytics } from '../../mock/data'

export default function Analytics(){
  const { totals, byStatus } = eventAnalytics
  return (
    <Layout portal="event">
      <div className="hero"><div className="title">Event Analytics</div></div>
      <div style={{marginTop:16}} className="grid cols-3">
        <StatCard title="Events" value={totals.events} />
        <StatCard title="Registrations" value={totals.registrations} />
        <StatCard title="Attendees" value={totals.attendees} />
      </div>
      <div className="card" style={{marginTop:16}}>
        <div className="label">Status Breakdown</div>
        <table className="table">
          <thead><tr><th>Status</th><th>Count</th></tr></thead>
          <tbody>
            {byStatus.map(s => (
              <tr key={s.status}><td>{s.status}</td><td>{s.count}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}
