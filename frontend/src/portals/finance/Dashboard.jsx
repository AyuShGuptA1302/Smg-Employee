import Layout from '../Layout'
import StatCard from '../StatCard'

export default function FinanceDashboard() {
  return (
    <Layout portal="finance">
      <div className="hero">
        <div className="title">Finance · Overview</div>
      </div>
      <div style={{ marginTop: 16 }} className="grid cols-3">
        <StatCard title="Total Budget" value="₹1.2Cr" />
        <StatCard title="Expenses" value="₹45L" />
        <StatCard title="Pending Approvals" value="5" />
      </div>
    </Layout>
  )
}
