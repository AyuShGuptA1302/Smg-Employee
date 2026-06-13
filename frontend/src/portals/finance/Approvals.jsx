import { useState } from 'react'
import Layout from '../../components/Layout'
import Modal from '../../components/Modal'
import { useMockApi, useSearch, useSort } from '../../hooks/useMockApi'
import { financeApprovals as initialApprovals } from '../../mock/data'

function formatCurrency(n){ return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n) }

export default function Approvals(){
  const { data, api } = useMockApi('finance:approvals', initialApprovals)
  const [query, setQuery] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [sortBy, setSortBy] = useState('item')
  const [sortDir, setSortDir] = useState('asc')

  const filtered = useSearch(data, ['id', 'item', 'requester', 'status'], query)
  const items = useSort(filtered, sortBy, sortDir)

  const approve = async (id) => { await api.update(a => a.id === id, () => ({ status: 'Approved' })) }
  const deny = async (id) => { await api.update(a => a.id === id, () => ({ status: 'Denied' })) }
  const remove = async (id) => { await api.remove(a => a.id === id) }

  const onCreate = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const item = String(form.get('item') || '').trim()
    const requester = String(form.get('requester') || '').trim()
    const amount = parseInt(String(form.get('amount') || '0'), 10)
    if (!item || !requester || !amount) return
    const id = `APR-${Math.floor(100 + Math.random()*900)}`
    await api.add({ id, item, requester, amount, status: 'Pending' })
    setCreateOpen(false)
    e.currentTarget.reset()
  }

  const changeSort = (field) => {
    if (sortBy === field) setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    else { setSortBy(field); setSortDir('asc') }
  }

  return (
    <Layout portal="finance">
      <div className="hero">
        <div className="title">Approvals</div>
        <div style={{display:'flex', gap:8}}>
          <input placeholder="Search approvals..." value={query} onChange={e=>setQuery(e.target.value)} />
          <button className="btn" onClick={()=>setCreateOpen(true)}>+ New Request</button>
        </div>
      </div>
      <div className="card" style={{marginTop:16}}>
        <table className="table">
          <thead><tr>
            <th onClick={()=>changeSort('id')} style={{cursor:'pointer'}}>ID</th>
            <th onClick={()=>changeSort('item')} style={{cursor:'pointer'}}>Item</th>
            <th onClick={()=>changeSort('requester')} style={{cursor:'pointer'}}>Requester</th>
            <th onClick={()=>changeSort('amount')} style={{cursor:'pointer'}}>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr></thead>
          <tbody>
            {items.map(i => (
              <tr key={i.id}>
                <td style={{color:'#1f65ff',fontWeight:600}}>{i.id}</td>
                <td>{i.item}</td>
                <td>{i.requester}</td>
                <td>{formatCurrency(i.amount)}</td>
                <td><span className={`badge ${i.status === 'Approved' ? 'success' : i.status === 'Denied' ? 'error' : 'warning'}`}>{i.status}</span></td>
                <td>
                  <div className="actions">
                    <button onClick={()=>approve(i.id)}>✅</button>
                    <button onClick={()=>deny(i.id)}>❌</button>
                    <button onClick={()=>remove(i.id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={createOpen} title="New Approval Request" onClose={()=>setCreateOpen(false)}>
        <form onSubmit={onCreate} style={{display:'grid', gap:8}}>
          <label className="label">Item</label>
          <input name="item" placeholder="Budget Increase - Ops" />
          <label className="label">Requester</label>
          <input name="requester" placeholder="R. Sharma" />
          <label className="label">Amount</label>
          <input name="amount" type="number" step="1" placeholder="350000" />
          <div style={{display:'flex', gap:8, marginTop:8}}>
            <button type="submit" className="btn">Submit</button>
            <button type="button" onClick={()=>setCreateOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}
