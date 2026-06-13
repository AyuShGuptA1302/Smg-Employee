import { useState, useMemo } from 'react'
import Layout from '../../components/Layout'
import StatCard from '../../components/StatCard'
import Modal from '../../components/Modal'
import { useMockApi, useSort } from '../../hooks/useMockApi'
import { financeBudget as initialBudget } from '../../mock/data'

function formatCurrency(n){ return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n) }

export default function Budget(){
  const [open, setOpen] = useState(false)
  const { data, api } = useMockApi('finance:budget', initialBudget)
  const [sortBy, setSortBy] = useState('department')
  const [sortDir, setSortDir] = useState('asc')
  const budgets = useSort(data, sortBy, sortDir)

  const totals = useMemo(() => {
    const allocated = data.reduce((s,b)=>s + (b.allocated||0), 0)
    const spent = data.reduce((s,b)=>s + (b.spent||0), 0)
    const pct = allocated ? Math.round((spent/allocated)*100) : 0
    return { allocated, spent, pct }
  }, [data])

  const onAdd = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const department = String(form.get('department') || '').trim()
    const allocated = parseInt(String(form.get('allocated') || '0'), 10)
    if (!department || !allocated) return
    const id = `BUD-${Math.floor(1000 + Math.random()*9000)}`
    await api.add({ id, department, allocated, spent: 0 })
    e.currentTarget.reset()
  }

  const updateSpent = async (id, delta) => {
    await api.update(b => b.id === id, (b) => ({ spent: Math.max(0, (b.spent||0) + delta) }))
  }

  const remove = async (id) => { await api.remove(b => b.id === id) }
  const changeSort = (field) => {
    if (sortBy === field) setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    else { setSortBy(field); setSortDir('asc') }
  }

  return (
    <Layout portal="finance">
      <div className="hero">
        <div className="title">Finance · Budget Overview</div>
      </div>
      <div style={{marginTop:16}} className="grid cols-3">
        <StatCard title="Total Budget" value={formatCurrency(totals.allocated)} onClick={()=>setOpen(true)} />
        <StatCard title="Spent" value={formatCurrency(totals.spent)} subtitle={`${totals.pct}%`} onClick={()=>setOpen(true)} />
        <StatCard title="Pending Approvals" value={12} badge={{type:'warning', label:'Medium'}} onClick={()=>setOpen(true)} />
      </div>

      <div className="card" style={{marginTop:16}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div className="label">Department Budgets</div>
          <form onSubmit={onAdd} style={{display:'flex', gap:8}}>
            <input name="department" placeholder="Department" />
            <input name="allocated" type="number" step="1" placeholder="500000" />
            <button className="btn" type="submit">+ Add</button>
          </form>
        </div>
        <table className="table" style={{marginTop:12}}>
          <thead><tr>
            <th onClick={()=>changeSort('department')} style={{cursor:'pointer'}}>Department</th>
            <th onClick={()=>changeSort('allocated')} style={{cursor:'pointer'}}>Allocated</th>
            <th onClick={()=>changeSort('spent')} style={{cursor:'pointer'}}>Spent</th>
            <th>Actions</th>
          </tr></thead>
          <tbody>
            {budgets.map(b => (
              <tr key={b.id}>
                <td>{b.department}</td>
                <td>{formatCurrency(b.allocated)}</td>
                <td>{formatCurrency(b.spent)}</td>
                <td>
                  <div className="actions">
                    <button onClick={()=>updateSpent(b.id, 50000)}>+50k</button>
                    <button onClick={()=>updateSpent(b.id, -50000)}>-50k</button>
                    <button onClick={()=>remove(b.id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} title="Finance KPI Details" onClose={()=>setOpen(false)}>
        <p className="label">Quarterly breakdown</p>
        <ul>
          <li>Q1: {formatCurrency(2800000)}</li>
          <li>Q2: {formatCurrency(2550000)}</li>
          <li>Q3: {formatCurrency(2485000)}</li>
        </ul>
      </Modal>
    </Layout>
  )
}
