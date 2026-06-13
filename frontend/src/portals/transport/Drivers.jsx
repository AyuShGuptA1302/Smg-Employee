import { useMemo, useState } from 'react'
import Layout from '../../components/Layout'
import Modal from '../../components/Modal'
import { useMockApi, useSearch, useSort } from '../../hooks/useMockApi'
import { transportDrivers as initialDrivers } from '../../mock/data'

export default function Drivers(){
  const { data, api } = useMockApi('transport:drivers', initialDrivers)
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortDir, setSortDir] = useState('asc')
  const [createOpen, setCreateOpen] = useState(false)

  const filtered = useSearch(data, ['name', 'id', 'phone', 'status'], query)
  const drivers = useSort(filtered, sortBy, sortDir)

  const totals = useMemo(() => ({
    active: data.filter(d => d.status === 'Active').length,
    inactive: data.filter(d => d.status !== 'Active').length,
  }), [data])

  const toggleStatus = async (id) => {
    await api.update(d => d.id === id, (d) => ({ status: d.status === 'Active' ? 'Inactive' : 'Active' }))
  }

  const removeDriver = async (id) => {
    await api.remove(d => d.id === id)
  }

  const onCreate = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const name = String(form.get('name') || '').trim()
    const phone = String(form.get('phone') || '').trim()
    if (!name) return
    const id = `DRV${Math.floor(100 + Math.random()*900)}`
    await api.add({ id, name, phone, status: 'Active' })
    setCreateOpen(false)
    e.currentTarget.reset()
  }

  const changeSort = (field) => {
    if (sortBy === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortDir('asc')
    }
  }

  return (
    <Layout portal="transport-hr">
      <div className="hero">
        <div className="title">Drivers</div>
        <div style={{display:'flex', gap:8}}>
          <input placeholder="Search drivers..." value={query} onChange={e=>setQuery(e.target.value)} />
          <button className="btn" onClick={()=>setCreateOpen(true)}>+ Add Driver</button>
        </div>
      </div>
      <div style={{marginTop:16}} className="grid cols-3">
        <div className="card kpi"><div><div style={{fontWeight:700, fontSize:18}}>{data.length}</div><div className="label">Total</div></div></div>
        <div className="card kpi"><div><div style={{fontWeight:700, fontSize:18}}>{totals.active}</div><div className="label">Active</div></div></div>
        <div className="card kpi"><div><div style={{fontWeight:700, fontSize:18}}>{totals.inactive}</div><div className="label">Inactive</div></div></div>
      </div>
      <div className="card" style={{marginTop:16}}>
        <table className="table">
          <thead>
            <tr>
              <th onClick={()=>changeSort('name')} style={{cursor:'pointer'}}>Name</th>
              <th onClick={()=>changeSort('id')} style={{cursor:'pointer'}}>ID</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map(d => (
              <tr key={d.id}>
                <td>{d.name}</td>
                <td style={{color:'#1f65ff',fontWeight:600}}>{d.id}</td>
                <td>{d.phone}</td>
                <td><span className={`badge ${d.status === 'Active' ? 'success' : 'warning'}`}>{d.status}</span></td>
                <td>
                  <div className="actions">
                    <button onClick={()=>toggleStatus(d.id)}>{d.status === 'Active' ? '⏸' : '▶️'}</button>
                    <button onClick={()=>removeDriver(d.id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={createOpen} title="Add Driver" onClose={()=>setCreateOpen(false)}>
        <form onSubmit={onCreate} style={{display:'grid', gap:8}}>
          <label className="label">Name</label>
          <input name="name" placeholder="Full name" />
          <label className="label">Phone</label>
          <input name="phone" placeholder="+91 ..." />
          <div style={{display:'flex', gap:8, marginTop:8}}>
            <button type="submit" className="btn">Save</button>
            <button type="button" onClick={()=>setCreateOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}
