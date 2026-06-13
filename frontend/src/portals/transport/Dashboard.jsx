import Layout from '../Layout'
import StatCard from '../StatCard'
import { useMockApi } from '../../hooks/useMockApi'
import { transportDrivers, transportVehicles, transportRoutes } from '../../mock/data'

export default function TransportDashboard() {
  const drivers = useMockApi('transport:drivers', transportDrivers).data
  const vehicles = useMockApi('transport:vehicles', transportVehicles).data
  const routes = useMockApi('transport:routes', transportRoutes).data

  return (
    <Layout portal="transport-hr">
      <div className="hero">
        <div className="title">Transport HR · Overview</div>
      </div>
      <div style={{ marginTop: 16 }} className="grid cols-3">
        <StatCard title="Drivers" value={drivers.length} />
        <StatCard title="Vehicles" value={vehicles.length} />
        <StatCard title="Routes" value={routes.length} />
      </div>
    </Layout>
  )
}
