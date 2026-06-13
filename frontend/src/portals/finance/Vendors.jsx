import { useState } from 'react'
import Layout from '../../components/Layout'
import Modal from '../../components/Modal'
import { useMockApi, useSearch, useSort } from '../../hooks/useMockApi'
import { financeVendors as initialVendors } from '../../mock/data'

export default function Vendors(){
  const { data, api } = useMockApi('finance:vendors', initialVendors)
  const [query, setQuery] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [sortBy, setSortBy] = useState('name')
  const [sortDir, setSortDir] = useState('asc')

  const filtered = useSearch(data, ['id', 'name', 'category'], query)
  const vendors = useSort(filtered, sortBy, sortDir)

  const onCreate = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const name = String(form.get('name') || '').trim()
    const category = String(form.get('category') || '').trim()
    if (!name || !category) return
    const id = `VND-${name.toUpperCase().split(' ').join('-')}`
    await api.add({ id, name, category })
    setCreateOpen(false)
    e.currentTarget.reset()
  }

  const remove = async (id) => { await api.remove(v => v.id === id) }
  const changeSort = (field) => {
    if (sortBy === field) setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    else { setSortBy(field); setSortDir('asc') }
  }

  return (
    <Layout portal="finance">
      <div className="hero">
        <div className="title">Vendors</div>
        <div style={{display:'flex', gap:8}}>
          <input placeholder="Search vendors..." value={query} onChange={e=>setQuery(e.target.value)} />
          <button className="btn" onClick={()=>setCreateOpen(true)}>+ Add Vendor</button>
        </div>
      </div>
      <div className="card" style={{marginTop:16}}>
        <table className="table">
          <thead><tr>
            <th onClick={()=>changeSort('id')} style={{cursor:'pointer'}}>ID</th>
            <th onClick={()=>changeSort('name')} style={{cursor:'pointer'}}>Name</th>
            <th onClick={()=>changeSort('category')} style={{cursor:'pointer'}}>Category</th>
            <th>Actions</th>
          </tr></thead>
          <tbody>
            {vendors.map(v => (
              <tr key={v.id}>
                <td style={{color:'#1f65ff',fontWeight:600}}>{v.id}</td>
                <td>{v.name}</td>
                <td>{v.category}</td>
                <td><div className="actions"><button onClick={()=>remove(v.id)}>🗑️</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={createOpen} title="Add Vendor" onClose={()=>setCreateOpen(false)}>
        <form onSubmit={onCreate} style={{display:'grid', gap:8}}>
          <label className="label">Name</label>
          <input name="name" placeholder="Alpha Corp" />
          <label className="label">Category</label>
          <input name="category" placeholder="IT" />
          <div style={{display:'flex', gap:8, marginTop:8}}>
            <button type="submit" className="btn">Save</button>
            <button type="button" onClick={()=>setCreateOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}
