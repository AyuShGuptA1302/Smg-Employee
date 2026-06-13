import { useState } from 'react'
import Layout from '../../components/Layout'
import Modal from '../../components/Modal'
import { useMockApi, useSearch, useSort } from '../../hooks/useMockApi'
import { eventSponsors as initialSponsors } from '../../mock/data'

export default function Sponsors(){
  const { data, api } = useMockApi('event:sponsors', initialSponsors)
  const [query, setQuery] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [sortBy, setSortBy] = useState('name')
  const [sortDir, setSortDir] = useState('asc')

  const filtered = useSearch(data, ['name', 'tier'], query)
  const sponsors = useSort(filtered, sortBy, sortDir)

  const onCreate = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const name = String(form.get('name') || '').trim()
    const tier = String(form.get('tier') || 'Bronze').trim()
    if (!name) return
    const id = `SP${Math.floor(100 + Math.random()*900)}`
    await api.add({ id, name, tier })
    setCreateOpen(false)
    e.currentTarget.reset()
  }

  const remove = async (id) => { await api.remove(s => s.id === id) }
  const changeTier = async (id) => {
    const tiers = ['Bronze', 'Silver', 'Gold', 'Platinum']
    const idx = tiers.indexOf(data.find(s => s.id === id)?.tier || 'Bronze')
    await api.update(s => s.id === id, () => ({ tier: tiers[(idx + 1) % tiers.length] }))
  }
  const changeSort = (field) => {
    if (sortBy === field) setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    else { setSortBy(field); setSortDir('asc') }
  }

  return (
    <Layout portal="event">
      <div className="hero">
        <div className="title">Sponsors</div>
        <div style={{display:'flex', gap:8}}>
          <input placeholder="Search sponsors..." value={query} onChange={e=>setQuery(e.target.value)} />
          <button className="btn" onClick={()=>setCreateOpen(true)}>+ Add Sponsor</button>
        </div>
      </div>
      <div className="card" style={{marginTop:16}}>
        <table className="table">
          <thead><tr>
            <th onClick={()=>changeSort('name')} style={{cursor:'pointer'}}>Name</th>
            <th onClick={()=>changeSort('tier')} style={{cursor:'pointer'}}>Tier</th>
            <th>Actions</th>
          </tr></thead>
          <tbody>
            {sponsors.map(s => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td><span className="badge success">{s.tier}</span></td>
                <td>
                  <div className="actions">
                    <button onClick={()=>changeTier(s.id)}>↻</button>
                    <button onClick={()=>remove(s.id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={createOpen} title="Add Sponsor" onClose={()=>setCreateOpen(false)}>
        <form onSubmit={onCreate} style={{display:'grid', gap:8}}>
          <label className="label">Name</label>
          <input name="name" placeholder="Alpha Corp" />
          <label className="label">Tier</label>
          <select name="tier">
            <option>Bronze</option>
            <option>Silver</option>
            <option>Gold</option>
            <option>Platinum</option>
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
