import { useState } from 'react'
import Layout from '../../components/Layout'
import Modal from '../../components/Modal'
import { useMockApi, useSearch, useSort } from '../../hooks/useMockApi'
import { financeExpenses as initialExpenses } from '../../mock/data'

function formatCurrency(n) { return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n) }

export default function Expenses(){
  const { data, api } = useMockApi('finance:expenses', initialExpenses)
  const [query, setQuery] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [sortBy, setSortBy] = useState('date')
  const [sortDir, setSortDir] = useState('desc')

  const filtered = useSearch(data, ['id', 'desc', 'status'], query)
  const expenses = useSort(filtered, sortBy, sortDir)

  const remove = async (id) => { await api.remove(e => e.id === id) }

  const onCreate = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const desc = String(form.get('desc') || '').trim()
    const amount = parseInt(String(form.get('amount') || '0'), 10)
    const date = String(form.get('date') || '').trim()
    if (!desc || !date || !amount) return
    const id = `EXP-${Math.floor(1000 + Math.random()*9000)}`
    await api.add({ id, desc, amount, date, status: 'Pending' })
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
        <div className="title">Expenses</div>
        <div style={{display:'flex', gap:8}}>
          <input placeholder="Search expenses..." value={query} onChange={e=>setQuery(e.target.value)} />
          <button className="btn" onClick={()=>setCreateOpen(true)}>+ Add Expense</button>
        </div>
      </div>
      <div className="card" style={{marginTop:16}}>
        <table className="table">
          <thead>
            <tr>
              <th onClick={()=>changeSort('id')} style={{cursor:'pointer'}}>ID</th>
              <th onClick={()=>changeSort('desc')} style={{cursor:'pointer'}}>Description</th>
              <th onClick={()=>changeSort('amount')} style={{cursor:'pointer'}}>Amount</th>
              <th onClick={()=>changeSort('date')} style={{cursor:'pointer'}}>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(e => (
              <tr key={e.id}>
                <td style={{color:'#1f65ff',fontWeight:600}}>{e.id}</td>
                <td>{e.desc}</td>
                <td>{formatCurrency(e.amount)}</td>
                <td>{new Date(e.date).toLocaleDateString()}</td>
                <td><span className={`badge ${e.status === 'Approved' ? 'success' : 'warning'}`}>{e.status}</span></td>
                <td>
                  <div className="actions">
                    <button onClick={()=>remove(e.id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={createOpen} title="Add Expense" onClose={()=>setCreateOpen(false)}>
        <form onSubmit={onCreate} style={{display:'grid', gap:8}}>
          <label className="label">Description</label>
          <input name="desc" placeholder="Office supplies" />
          <label className="label">Amount</label>
          <input name="amount" type="number" step="1" placeholder="12000" />
          <label className="label">Date</label>
          <input name="date" type="date" />
          <div style={{display:'flex', gap:8, marginTop:8}}>
            <button type="submit" className="btn">Save</button>
            <button type="button" onClick={()=>setCreateOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}
