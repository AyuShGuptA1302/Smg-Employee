import { useState } from 'react'
import Layout from '../../components/Layout'
import Modal from '../../components/Modal'
import { useMockApi, useSearch, useSort } from '../../hooks/useMockApi'
import { eventVolunteers as initialVolunteers } from '../../mock/data'

export default function Volunteers(){
  const { data, api } = useMockApi('event:volunteers', initialVolunteers)
  const [query, setQuery] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [sortBy, setSortBy] = useState('name')
  const [sortDir, setSortDir] = useState('asc')

  const filtered = useSearch(data, ['name', 'role'], query)
  const volunteers = useSort(filtered, sortBy, sortDir)

  const onCreate = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const name = String(form.get('name') || '').trim()
    const role = String(form.get('role') || '').trim()
    if (!name || !role) return
    const id = `VOL${Math.floor(10 + Math.random()*90)}`
    await api.add({ id, name, role })
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
        <div className="title">Volunteers</div>
        <div style={{display:'flex', gap:8}}>
          <input placeholder="Search volunteers..." value={query} onChange={e=>setQuery(e.target.value)} />
          <button className="btn" onClick={()=>setCreateOpen(true)}>+ Add Volunteer</button>
        </div>
      </div>
      <div className="card" style={{marginTop:16}}>
        <table className="table">
          <thead><tr>
            <th onClick={()=>changeSort('name')} style={{cursor:'pointer'}}>Name</th>
            <th onClick={()=>changeSort('role')} style={{cursor:'pointer'}}>Role</th>
            <th>Actions</th>
          </tr></thead>
          <tbody>
            {volunteers.map(v => (
              <tr key={v.id}>
                <td>{v.name}</td>
                <td>{v.role}</td>
                <td><div className="actions"><button onClick={()=>remove(v.id)}>🗑️</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={createOpen} title="Add Volunteer" onClose={()=>setCreateOpen(false)}>
        <form onSubmit={onCreate} style={{display:'grid', gap:8}}>
          <label className="label">Name</label>
          <input name="name" placeholder="Nisha" />
          <label className="label">Role</label>
          <input name="role" placeholder="Usher" />
          <div style={{display:'flex', gap:8, marginTop:8}}>
            <button type="submit" className="btn">Save</button>
            <button type="button" onClick={()=>setCreateOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}
