import { useState } from 'react'
import Layout from '../../components/Layout'
import Modal from '../../components/Modal'
import { useMockApi, useSearch, useSort } from '../../hooks/useMockApi'
import { financePayroll as initialPayroll } from '../../mock/data'

function formatCurrency(n){ return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n) }

export default function Payroll(){
  const { data, api } = useMockApi('finance:payroll', initialPayroll)
  const [query, setQuery] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [sortBy, setSortBy] = useState('cycle')
  const [sortDir, setSortDir] = useState('desc')

  const filtered = useSearch(data, ['cycle', 'status'], query)
  const payrolls = useSort(filtered, sortBy, sortDir)

  const processRun = async (id) => { await api.update(p => p.id === id, () => ({ status: 'Processed' })) }
  const remove = async (id) => { await api.remove(p => p.id === id) }

  const onCreate = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const cycle = String(form.get('cycle') || '').trim()
    const employees = parseInt(String(form.get('employees') || '0'), 10)
    const total = parseInt(String(form.get('total') || '0'), 10)
    if (!cycle || !employees || !total) return
    const id = `PAY-${Math.floor(100 + Math.random()*900)}`
    await api.add({ id, cycle, employees, total, status: 'Pending' })
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
        <div className="title">Payroll</div>
        <div style={{display:'flex', gap:8}}>
          <input placeholder="Search payroll..." value={query} onChange={e=>setQuery(e.target.value)} />
          <button className="btn" onClick={()=>setCreateOpen(true)}>+ New Run</button>
        </div>
      </div>
      <div className="card" style={{marginTop:16}}>
        <table className="table">
          <thead><tr>
            <th onClick={()=>changeSort('cycle')} style={{cursor:'pointer'}}>Cycle</th>
            <th onClick={()=>changeSort('employees')} style={{cursor:'pointer'}}>Employees</th>
            <th onClick={()=>changeSort('total')} style={{cursor:'pointer'}}>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr></thead>
          <tbody>
            {payrolls.map(p => (
              <tr key={p.id}>
                <td>{p.cycle}</td>
                <td>{p.employees}</td>
                <td>{formatCurrency(p.total)}</td>
                <td><span className={`badge ${p.status === 'Processed' ? 'success' : 'warning'}`}>{p.status}</span></td>
                <td>
                  <div className="actions">
                    {p.status !== 'Processed' && <button onClick={()=>processRun(p.id)}>▶️</button>}
                    <button onClick={()=>remove(p.id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={createOpen} title="New Payroll Run" onClose={()=>setCreateOpen(false)}>
        <form onSubmit={onCreate} style={{display:'grid', gap:8}}>
          <label className="label">Cycle</label>
          <input name="cycle" placeholder="Jan 2026" />
          <label className="label">Employees</label>
          <input name="employees" type="number" step="1" />
          <label className="label">Total</label>
          <input name="total" type="number" step="1" />
          <div style={{display:'flex', gap:8, marginTop:8}}>
            <button type="submit" className="btn">Create</button>
            <button type="button" onClick={()=>setCreateOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}
