import Layout from '../Layout'
import StatCard from '../StatCard'
import { useMockApi } from '../../hooks/useMockApi'
import { hrUsers } from '../../mock/data'

export default function HRDashboard() {
  const users = useMockApi('hr:users', hrUsers).data

  return (
    <Layout portal="hr">
      <div className="hero">
        <div className="title">HR · Overview</div>
      </div>
      <div style={{ marginTop: 16 }} className="grid cols-3">
        <StatCard title="Total Employees" value={users.length} />
        <StatCard title="Active" value={users.filter(u => u.status === 'Active').length} />
        <StatCard title="Pending Requests" value="12" />
      </div>
    </Layout>
  )
}
