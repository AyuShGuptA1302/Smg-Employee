import { useState } from 'react'
import Layout from '../../components/Layout'
import { useMockApi, useSearch, useSort } from '../../hooks/useMockApi'
import { financeInvoices as initialInvoices } from '../../mock/data'

function formatCurrency(n) { return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n) }
function formatDateISO(iso) { try { return new Date(iso).toLocaleDateString() } catch { return iso } }

export default function Invoices(){
  const { data, api } = useMockApi('finance:invoices', initialInvoices)
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('due')
  const [sortDir, setSortDir] = useState('asc')

  const filtered = useSearch(data, ['id', 'vendor', 'status'], query)
  const invoices = useSort(filtered, sortBy, sortDir)

  const markPaid = async (id) => {
    await api.update(i => i.id === id, () => ({ status: 'Paid' }))
  }
  const remove = async (id) => {
    await api.remove(i => i.id === id)
  }
  const changeSort = (field) => {
    if (sortBy === field) setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    else { setSortBy(field); setSortDir('asc') }
  }

  return (
    <Layout portal="finance">
      <div className="hero">
        <div className="title">Invoices</div>
        <input placeholder="Search invoices..." value={query} onChange={e=>setQuery(e.target.value)} />
      </div>
      <div className="card" style={{marginTop:16}}>
        <table className="table">
          <thead>
            <tr>
              <th onClick={()=>changeSort('id')} style={{cursor:'pointer'}}>ID</th>
              <th onClick={()=>changeSort('vendor')} style={{cursor:'pointer'}}>Vendor</th>
              <th onClick={()=>changeSort('amount')} style={{cursor:'pointer'}}>Amount</th>
              <th onClick={()=>changeSort('due')} style={{cursor:'pointer'}}>Due</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(i => (
              <tr key={i.id}>
                <td style={{color:'#1f65ff',fontWeight:600}}>{i.id}</td>
                <td>{i.vendor}</td>
                <td>{formatCurrency(i.amount)}</td>
                <td>{formatDateISO(i.due)}</td>
                <td><span className={`badge ${i.status === 'Paid' ? 'success' : 'warning'}`}>{i.status}</span></td>
                <td>
                  <div className="actions">
                    {i.status !== 'Paid' && <button onClick={()=>markPaid(i.id)}>✅</button>}
                    <button onClick={()=>remove(i.id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}
