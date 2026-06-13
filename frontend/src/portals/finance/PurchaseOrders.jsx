import { useState } from 'react'
import Layout from '../../components/Layout'
import Modal from '../../components/Modal'
import { useMockApi, useSearch, useSort } from '../../hooks/useMockApi'
import { financePurchaseOrders as initialPOs } from '../../mock/data'

function formatCurrency(n){ return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n) }
function formatDateISO(iso) { try { return new Date(iso).toLocaleDateString() } catch { return iso } }

export default function PurchaseOrders(){
  const { data, api } = useMockApi('finance:pos', initialPOs)
  const [query, setQuery] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [sortBy, setSortBy] = useState('date')
  const [sortDir, setSortDir] = useState('desc')

  const filtered = useSearch(data, ['id', 'vendor', 'status'], query)
  const pos = useSort(filtered, sortBy, sortDir)

  const cycleStatus = async (id) => {
    const seq = ['Created', 'Approved', 'Dispatched', 'Received']
    const curr = data.find(p => p.id === id)?.status || 'Created'
    const next = seq[(seq.indexOf(curr) + 1) % seq.length]
    await api.update(p => p.id === id, () => ({ status: next }))
  }
  const remove = async (id) => { await api.remove(p => p.id === id) }

  const onCreate = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const vendor = String(form.get('vendor') || '').trim()
    const amount = parseInt(String(form.get('amount') || '0'), 10)
    const date = String(form.get('date') || '').trim()
    if (!vendor || !amount || !date) return
    const id = `PO-${Math.floor(1000 + Math.random()*9000)}`
    await api.add({ id, vendor, amount, date, status: 'Created' })
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
        <div className="title">Purchase Orders</div>
        <div style={{display:'flex', gap:8}}>
          <input placeholder="Search POs..." value={query} onChange={e=>setQuery(e.target.value)} />
          <button className="btn" onClick={()=>setCreateOpen(true)}>+ Create PO</button>
        </div>
      </div>
      <div className="card" style={{marginTop:16}}>
        <table className="table">
          <thead><tr>
            <th onClick={()=>changeSort('id')} style={{cursor:'pointer'}}>ID</th>
            <th onClick={()=>changeSort('vendor')} style={{cursor:'pointer'}}>Vendor</th>
            <th onClick={()=>changeSort('amount')} style={{cursor:'pointer'}}>Amount</th>
            <th onClick={()=>changeSort('date')} style={{cursor:'pointer'}}>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr></thead>
          <tbody>
            {pos.map(p => (
              <tr key={p.id}>
                <td style={{color:'#1f65ff',fontWeight:600}}>{p.id}</td>
                <td>{p.vendor}</td>
                <td>{formatCurrency(p.amount)}</td>
                <td>{formatDateISO(p.date)}</td>
                <td><span className="badge warning">{p.status}</span></td>
                <td>
                  <div className="actions">
                    <button onClick={()=>cycleStatus(p.id)}>↻</button>
                    <button onClick={()=>remove(p.id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={createOpen} title="Create Purchase Order" onClose={()=>setCreateOpen(false)}>
        <form onSubmit={onCreate} style={{display:'grid', gap:8}}>
          <label className="label">Vendor</label>
          <input name="vendor" placeholder="Alpha Corp" />
          <label className="label">Amount</label>
          <input name="amount" type="number" step="1" />
          <label className="label">Date</label>
          <input name="date" type="date" />
          <div style={{display:'flex', gap:8, marginTop:8}}>
            <button type="submit" className="btn">Create</button>
            <button type="button" onClick={()=>setCreateOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}
