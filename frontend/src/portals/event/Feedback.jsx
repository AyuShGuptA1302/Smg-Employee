import { useState } from 'react'
import Layout from '../../components/Layout'
import Modal from '../../components/Modal'
import { useMockApi, useSearch } from '../../hooks/useMockApi'
import { eventFeedback as initialFeedback, eventEvents } from '../../mock/data'

export default function Feedback(){
  const { data, api } = useMockApi('event:feedback', initialFeedback)
  const [query, setQuery] = useState('')
  const [createOpen, setCreateOpen] = useState(false)

  const filtered = useSearch(data, ['comment', 'eventId'], query)

  const onCreate = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const eventId = String(form.get('eventId') || '').trim()
    const rating = parseInt(String(form.get('rating') || '0'), 10)
    const comment = String(form.get('comment') || '').trim()
    if (!eventId || !rating) return
    const id = `F${Math.floor(100 + Math.random()*900)}`
    await api.add({ id, eventId, rating, comment })
    setCreateOpen(false)
    e.currentTarget.reset()
  }

  const remove = async (id) => { await api.remove(f => f.id === id) }

  return (
    <Layout portal="event">
      <div className="hero">
        <div className="title">Feedback</div>
        <div style={{display:'flex', gap:8}}>
          <input placeholder="Search feedback..." value={query} onChange={e=>setQuery(e.target.value)} />
          <button className="btn" onClick={()=>setCreateOpen(true)}>+ Add Feedback</button>
        </div>
      </div>
      <div className="card" style={{marginTop:16}}>
        <table className="table">
          <thead><tr>
            <th>Event</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map(f => (
              <tr key={f.id}>
                <td>{eventEvents.find(e=>e.id===f.eventId)?.name || f.eventId}</td>
                <td>{'★'.repeat(f.rating)}{'☆'.repeat(Math.max(0,5-f.rating))}</td>
                <td>{f.comment}</td>
                <td><div className="actions"><button onClick={()=>remove(f.id)}>🗑️</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={createOpen} title="Add Feedback" onClose={()=>setCreateOpen(false)}>
        <form onSubmit={onCreate} style={{display:'grid', gap:8}}>
          <label className="label">Event</label>
          <select name="eventId">{eventEvents.map(e=> <option key={e.id} value={e.id}>{e.name}</option>)}</select>
          <label className="label">Rating (1-5)</label>
          <input name="rating" type="number" min="1" max="5" />
          <label className="label">Comment</label>
          <input name="comment" placeholder="Your thoughts..." />
          <div style={{display:'flex', gap:8, marginTop:8}}>
            <button type="submit" className="btn">Save</button>
            <button type="button" onClick={()=>setCreateOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}
