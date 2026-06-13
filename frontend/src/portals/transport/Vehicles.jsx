import { useState } from 'react'
import Layout from '../../components/Layout'
import Modal from '../../components/Modal'
import { useMockApi, useSearch, useSort } from '../../hooks/useMockApi'
import { transportVehicles as initialVehicles } from '../../mock/data'

export default function Vehicles(){
  const { data, api } = useMockApi('transport:vehicles', initialVehicles)
  const [query, setQuery] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [sortBy, setSortBy] = useState('plate')
  const [sortDir, setSortDir] = useState('asc')

  const filtered = useSearch(data, ['plate', 'model', 'status'], query)
  const vehicles = useSort(filtered, sortBy, sortDir)

  const toggleStatus = async (plate) => {
    await api.update(v => v.plate === plate, (v) => ({
      status: v.status === 'Available' ? 'In Service' : v.status === 'In Service' ? 'Maintenance' : 'Available'
    }))
  }

  const removeVehicle = async (plate) => {
    await api.remove(v => v.plate === plate)
  }

  const onCreate = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const plate = String(form.get('plate') || '').trim()
    const model = String(form.get('model') || '').trim()
    if (!plate || !model) return
    await api.add({ plate, model, status: 'Available' })
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
        <div className="title">Vehicles</div>
        <div style={{display:'flex', gap:8}}>
          <input placeholder="Search vehicles..." value={query} onChange={e=>setQuery(e.target.value)} />
          <button className="btn" onClick={()=>setCreateOpen(true)}>+ Add Vehicle</button>
        </div>
      </div>
      <div className="card" style={{marginTop:16}}>
        <table className="table">
          <thead><tr>
            <th onClick={()=>changeSort('plate')} style={{cursor:'pointer'}}>Plate</th>
            <th onClick={()=>changeSort('model')} style={{cursor:'pointer'}}>Model</th>
            <th>Status</th>
            <th>Actions</th></tr></thead>
          <tbody>
            {vehicles.map(v => (
              <tr key={v.plate}>
                <td>{v.plate}</td>
                <td>{v.model}</td>
                <td><span className={`badge ${v.status === 'Available' ? 'success' : v.status === 'In Service' ? 'warning' : 'error'}`}>{v.status}</span></td>
                <td>
                  <div className="actions">
                    <button onClick={()=>toggleStatus(v.plate)}>↻</button>
                    <button onClick={()=>removeVehicle(v.plate)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={createOpen} title="Add Vehicle" onClose={()=>setCreateOpen(false)}>
        <form onSubmit={onCreate} style={{display:'grid', gap:8}}>
          <label className="label">Plate</label>
          <input name="plate" placeholder="KA-01-1234" />
          <label className="label">Model</label>
          <input name="model" placeholder="Electric Van" />
          <div style={{display:'flex', gap:8, marginTop:8}}>
            <button type="submit" className="btn">Save</button>
            <button type="button" onClick={()=>setCreateOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}
