import { useState } from 'react'
import Layout from '../../components/Layout'
import Modal from '../../components/Modal'
import { useMockApi, useSearch, useSort } from '../../hooks/useMockApi'
import { financeReports as initialReports } from '../../mock/data'

export default function Reports(){
  const { data, api } = useMockApi('finance:reports', initialReports)
  const [query, setQuery] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [sortBy, setSortBy] = useState('name')
  const [sortDir, setSortDir] = useState('asc')

  const filtered = useSearch(data, ['id', 'name', 'period'], query)
  const reports = useSort(filtered, sortBy, sortDir)

  const onCreate = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const name = String(form.get('name') || '').trim()
    const period = String(form.get('period') || '').trim()
    if (!name || !period) return
    const id = `RPT-${Math.floor(100 + Math.random()*900)}`
    await api.add({ id, name, period })
    setCreateOpen(false)
    e.currentTarget.reset()
  }

  const remove = async (id) => { await api.remove(r => r.id === id) }
  const changeSort = (field) => {
    if (sortBy === field) setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    else { setSortBy(field); setSortDir('asc') }
  }

  return (
    <Layout portal="finance">
      <div className="hero">
        <div className="title">Reports</div>
        <div style={{display:'flex', gap:8}}>
          <input placeholder="Search reports..." value={query} onChange={e=>setQuery(e.target.value)} />
          <button className="btn" onClick={()=>setCreateOpen(true)}>+ New Report</button>
        </div>
      </div>
      <div className="card" style={{marginTop:16}}>
        <table className="table">
          <thead><tr>
            <th onClick={()=>changeSort('id')} style={{cursor:'pointer'}}>ID</th>
            <th onClick={()=>changeSort('name')} style={{cursor:'pointer'}}>Name</th>
            <th onClick={()=>changeSort('period')} style={{cursor:'pointer'}}>Period</th>
            <th>Actions</th>
          </tr></thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.id}>
                <td style={{color:'#1f65ff',fontWeight:600}}>{r.id}</td>
                <td>{r.name}</td>
                <td>{r.period}</td>
                <td><div className="actions"><button onClick={()=>remove(r.id)}>🗑️</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={createOpen} title="New Report" onClose={()=>setCreateOpen(false)}>
        <form onSubmit={onCreate} style={{display:'grid', gap:8}}>
          <label className="label">Name</label>
          <input name="name" placeholder="Monthly Spend" />
          <label className="label">Period</label>
          <input name="period" placeholder="Dec 2025" />
          <div style={{display:'flex', gap:8, marginTop:8}}>
            <button type="submit" className="btn">Create</button>
            <button type="button" onClick={()=>setCreateOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}
