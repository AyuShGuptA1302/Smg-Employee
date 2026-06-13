import { useState } from 'react'
import Layout from '../../components/Layout'
import Modal from '../../components/Modal'
import { useMockApi, useSearch, useSort } from '../../hooks/useMockApi'
import { eventEvents as initialEvents } from '../../mock/data'

function formatDateISO(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
  } catch { return iso }
}

export default function Events(){
  const { data, api } = useMockApi('event:events', initialEvents)
  const [query, setQuery] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [sortBy, setSortBy] = useState('date')
  const [sortDir, setSortDir] = useState('asc')

  const filtered = useSearch(data, ['name', 'location', 'status'], query)
  const events = useSort(filtered, sortBy, sortDir)

  const removeEvent = async (id) => {
    await api.remove(e => e.id === id)
  }

  const onCreate = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const name = String(form.get('name') || '').trim()
    const location = String(form.get('location') || '').trim()
    const date = String(form.get('date') || '').trim()
    const status = String(form.get('status') || '').trim() || 'Upcoming'
    if (!name || !date) return
    const id = `E${Math.floor(100 + Math.random()*900)}`
    await api.add({ id, name, location, date, status })
    setCreateOpen(false)
    e.currentTarget.reset()
  }

  const changeSort = (field) => {
    if (sortBy === field) setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    else { setSortBy(field); setSortDir('asc') }
  }

  return (
    <Layout portal="event">
      <div className="hero">
        <div className="title">Event Management</div>
        <div style={{display:'flex', gap:8}}>
          <input placeholder="Search events..." value={query} onChange={e=>setQuery(e.target.value)} />
          <button className="btn" onClick={()=>setCreateOpen(true)}>+ Create Event</button>
        </div>
      </div>
      <div className="card" style={{marginTop:16}}>
        <table className="table">
          <thead>
            <tr>
              <th onClick={()=>changeSort('name')} style={{cursor:'pointer'}}>Event</th>
              <th onClick={()=>changeSort('date')} style={{cursor:'pointer'}}>Date</th>
              <th onClick={()=>changeSort('location')} style={{cursor:'pointer'}}>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id}>
                <td>{e.name}</td>
                <td>{formatDateISO(e.date)}</td>
                <td>{e.location}</td>
                <td><span className={`badge ${e.status === 'Upcoming' ? 'success' : e.status === 'Open' ? 'warning' : 'error'}`}>{e.status}</span></td>
                <td><div className="actions"><button onClick={()=>removeEvent(e.id)}>🗑️</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={createOpen} title="Create Event" onClose={()=>setCreateOpen(false)}>
        <form onSubmit={onCreate} style={{display:'grid', gap:8}}>
          <label className="label">Name</label>
          <input name="name" placeholder="Annual Townhall" />
          <label className="label">Date</label>
          <input name="date" type="date" />
          <label className="label">Location</label>
          <input name="location" placeholder="Auditorium" />
          <label className="label">Status</label>
          <select name="status">
            <option>Upcoming</option>
            <option>Open</option>
            <option>Closed</option>
          </select>
          <div style={{display:'flex', gap:8, marginTop:8}}>
            <button type="submit" className="btn">Save</button>
            <button type="button" onClick={()=>setCreateOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}
