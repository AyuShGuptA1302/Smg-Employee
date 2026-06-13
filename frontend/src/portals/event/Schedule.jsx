import { useState } from 'react'
import Layout from '../../components/Layout'
import Modal from '../../components/Modal'
import { useMockApi, useSearch, useSort } from '../../hooks/useMockApi'
import { eventSchedule as initialSchedule, eventEvents } from '../../mock/data'

function fmt(iso) { try { return new Date(iso).toLocaleString() } catch { return iso } }

export default function Schedule(){
  const { data, api } = useMockApi('event:schedule', initialSchedule)
  const [query, setQuery] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [sortBy, setSortBy] = useState('start')
  const [sortDir, setSortDir] = useState('asc')

  const filtered = useSearch(data, ['title', 'eventId'], query)
  const schedule = useSort(filtered, sortBy, sortDir)

  const remove = async (id) => { await api.remove(s => s.id === id) }

  const onCreate = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const title = String(form.get('title') || '').trim()
    const eventId = String(form.get('eventId') || '').trim()
    const start = String(form.get('start') || '').trim()
    const end = String(form.get('end') || '').trim()
    if (!title || !eventId || !start || !end) return
    const id = `SCH-${Math.floor(100 + Math.random()*900)}`
    await api.add({ id, title, eventId, start, end })
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
        <div className="title">Schedule</div>
        <div style={{display:'flex', gap:8}}>
          <input placeholder="Search schedule..." value={query} onChange={e=>setQuery(e.target.value)} />
          <button className="btn" onClick={()=>setCreateOpen(true)}>+ Add Item</button>
        </div>
      </div>
      <div className="card" style={{marginTop:16}}>
        <table className="table">
          <thead><tr>
            <th>Event</th>
            <th>Title</th>
            <th onClick={()=>changeSort('start')} style={{cursor:'pointer'}}>Start</th>
            <th onClick={()=>changeSort('end')} style={{cursor:'pointer'}}>End</th>
            <th>Actions</th>
          </tr></thead>
          <tbody>
            {schedule.map(s => (
              <tr key={s.id}>
                <td>{eventEvents.find(e=>e.id===s.eventId)?.name || s.eventId}</td>
                <td>{s.title}</td>
                <td>{fmt(s.start)}</td>
                <td>{fmt(s.end)}</td>
                <td><div className="actions"><button onClick={()=>remove(s.id)}>🗑️</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={createOpen} title="Add Schedule Item" onClose={()=>setCreateOpen(false)}>
        <form onSubmit={onCreate} style={{display:'grid', gap:8}}>
          <label className="label">Event</label>
          <select name="eventId">
            {eventEvents.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
          <label className="label">Title</label>
          <input name="title" placeholder="Opening Remarks" />
          <label className="label">Start</label>
          <input name="start" type="datetime-local" />
          <label className="label">End</label>
          <input name="end" type="datetime-local" />
          <div style={{display:'flex', gap:8, marginTop:8}}>
            <button type="submit" className="btn">Save</button>
            <button type="button" onClick={()=>setCreateOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}
