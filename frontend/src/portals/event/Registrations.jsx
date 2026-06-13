import { useState } from 'react'
import Layout from '../../components/Layout'
import Modal from '../../components/Modal'
import { useMockApi, useSearch } from '../../hooks/useMockApi'
import { eventRegistrations as initialRegs, eventEvents } from '../../mock/data'

export default function Registrations(){
  const { data, api } = useMockApi('event:registrations', initialRegs)
  const [query, setQuery] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const filtered = useSearch(data, ['attendee', 'email', 'status', 'eventId'], query)

  const onCreate = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const attendee = String(form.get('attendee') || '').trim()
    const email = String(form.get('email') || '').trim()
    const eventId = String(form.get('eventId') || '').trim()
    if (!attendee || !email || !eventId) return
    const id = `REG${Math.floor(1000 + Math.random()*9000)}`
    await api.add({ id, attendee, email, status: 'Pending', eventId })
    setCreateOpen(false)
    e.currentTarget.reset()
  }

  const approve = async (id) => {
    await api.update(r => r.id === id, () => ({ status: 'Confirmed' }))
  }
  const remove = async (id) => {
    await api.remove(r => r.id === id)
  }

  return (
    <Layout portal="event">
      <div className="hero">
        <div className="title">Registrations</div>
        <div style={{display:'flex', gap:8}}>
          <input placeholder="Search registrations..." value={query} onChange={e=>setQuery(e.target.value)} />
          <button className="btn" onClick={()=>setCreateOpen(true)}>+ Add Registration</button>
        </div>
      </div>
      <div className="card" style={{marginTop:16}}>
        <table className="table">
          <thead>
            <tr>
              <th>Attendee</th>
              <th>Email</th>
              <th>Event</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id}>
                <td>{r.attendee}</td>
                <td>{r.email}</td>
                <td>{eventEvents.find(e=>e.id===r.eventId)?.name || r.eventId}</td>
                <td><span className={`badge ${r.status === 'Confirmed' ? 'success' : 'warning'}`}>{r.status}</span></td>
                <td>
                  <div className="actions">
                    {r.status !== 'Confirmed' && <button onClick={()=>approve(r.id)}>✅</button>}
                    <button onClick={()=>remove(r.id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={createOpen} title="Add Registration" onClose={()=>setCreateOpen(false)}>
        <form onSubmit={onCreate} style={{display:'grid', gap:8}}>
          <label className="label">Attendee</label>
          <input name="attendee" placeholder="Full name" />
          <label className="label">Email</label>
          <input name="email" type="email" placeholder="name@example.com" />
          <label className="label">Event</label>
          <select name="eventId">
            {eventEvents.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
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
