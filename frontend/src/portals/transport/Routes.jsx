import { useState } from 'react'
import Layout from '../../components/Layout'
import Modal from '../../components/Modal'
import { useMockApi, useSearch, useSort } from '../../hooks/useMockApi'
import { transportRoutes as initialRoutes } from '../../mock/data'

export default function Routes(){
  const { data, api } = useMockApi('transport:routes', initialRoutes)
  const [query, setQuery] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [sortBy, setSortBy] = useState('name')
  const [sortDir, setSortDir] = useState('asc')

  const filtered = useSearch(data, ['name'], query)
  const routes = useSort(filtered, sortBy, sortDir)

  const removeRoute = async (id) => {
    await api.remove(r => r.id === id)
  }

  const onCreate = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const name = String(form.get('name') || '').trim()
    const distanceKm = parseFloat(String(form.get('distanceKm') || '0'))
    const avgMins = parseInt(String(form.get('avgMins') || '0'), 10)
    if (!name) return
    const id = `R${Math.floor(100 + Math.random()*900)}`
    await api.add({ id, name, distanceKm, avgMins })
    setCreateOpen(false)
    e.currentTarget.reset()
  }

  const changeSort = (field) => {
    if (sortBy === field) setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    else { setSortBy(field); setSortDir('asc') }
  }

  return (
    <Layout portal="transport-hr">
      <div className="hero">
        <div className="title">Routes</div>
        <div style={{display:'flex', gap:8}}>
          <input placeholder="Search routes..." value={query} onChange={e=>setQuery(e.target.value)} />
          <button className="btn" onClick={()=>setCreateOpen(true)}>+ Add Route</button>
        </div>
      </div>
      <div className="card" style={{marginTop:16}}>
        <table className="table">
          <thead><tr>
            <th onClick={()=>changeSort('name')} style={{cursor:'pointer'}}>Route</th>
            <th onClick={()=>changeSort('distanceKm')} style={{cursor:'pointer'}}>Distance</th>
            <th onClick={()=>changeSort('avgMins')} style={{cursor:'pointer'}}>Avg Time</th>
            <th>Actions</th>
          </tr></thead>
          <tbody>
            {routes.map(r => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{r.distanceKm?.toFixed(1)} km</td>
                <td>{r.avgMins} min</td>
                <td>
                  <div className="actions">
                    <button onClick={()=>removeRoute(r.id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={createOpen} title="Add Route" onClose={()=>setCreateOpen(false)}>
        <form onSubmit={onCreate} style={{display:'grid', gap:8}}>
          <label className="label">Name</label>
          <input name="name" placeholder="HQ → Production" />
          <label className="label">Distance (km)</label>
          <input name="distanceKm" type="number" step="0.1" placeholder="9.2" />
          <label className="label">Avg Time (mins)</label>
          <input name="avgMins" type="number" step="1" placeholder="25" />
          <div style={{display:'flex', gap:8, marginTop:8}}>
            <button type="submit" className="btn">Save</button>
            <button type="button" onClick={()=>setCreateOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}
