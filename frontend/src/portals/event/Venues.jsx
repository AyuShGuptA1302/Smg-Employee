import { useState } from 'react'
import Layout from '../../components/Layout'
import Modal from '../../components/Modal'
import { useMockApi, useSearch, useSort } from '../../hooks/useMockApi'
import { eventVenues as initialVenues } from '../../mock/data'

export default function Venues(){
  const { data, api } = useMockApi('event:venues', initialVenues)
  const [query, setQuery] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [sortBy, setSortBy] = useState('name')
  const [sortDir, setSortDir] = useState('asc')

  const filtered = useSearch(data, ['name', 'capacity'], query)
  const venues = useSort(filtered, sortBy, sortDir)

  const onCreate = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const name = String(form.get('name') || '').trim()
    const capacity = parseInt(String(form.get('capacity') || '0'), 10)
    if (!name || !capacity) return
    const id = `V${Math.floor(100 + Math.random()*900)}`
    await api.add({ id, name, capacity })
    setCreateOpen(false)
    e.currentTarget.reset()
  }

  const remove = async (id) => { await api.remove(v => v.id === id) }
  const changeSort = (field) => {
    if (sortBy === field) setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    else { setSortBy(field); setSortDir('asc') }
  }

  return (
    <Layout portal="event">
      <div className="hero">
        <div className="title">Venues</div>
        <div style={{display:'flex', gap:8}}>
          <input placeholder="Search venues..." value={query} onChange={e=>setQuery(e.target.value)} />
          <button className="btn" onClick={()=>setCreateOpen(true)}>+ Add Venue</button>
        </div>
      </div>
      <div className="card" style={{marginTop:16}}>
        <table className="table">
          <thead><tr>
            <th onClick={()=>changeSort('name')} style={{cursor:'pointer'}}>Name</th>
            <th onClick={()=>changeSort('capacity')} style={{cursor:'pointer'}}>Capacity</th>
            <th>Actions</th>
          </tr></thead>
          <tbody>
            {venues.map(v => (
              <tr key={v.id}>
                <td>{v.name}</td>
                <td>{v.capacity}</td>
                <td><div className="actions"><button onClick={()=>remove(v.id)}>🗑️</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={createOpen} title="Add Venue" onClose={()=>setCreateOpen(false)}>
        <form onSubmit={onCreate} style={{display:'grid', gap:8}}>
          <label className="label">Name</label>
          <input name="name" placeholder="Auditorium" />
          <label className="label">Capacity</label>
          <input name="capacity" type="number" step="1" placeholder="500" />
          <div style={{display:'flex', gap:8, marginTop:8}}>
            <button type="submit" className="btn">Save</button>
            <button type="button" onClick={()=>setCreateOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}
