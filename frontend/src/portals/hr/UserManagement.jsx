import { useMemo, useState } from 'react'
import Layout from '../../components/Layout'
import Modal from '../../components/Modal'
import { useMockApi, useSearch, useSort } from '../../hooks/useMockApi'
import { hrUsers as initialUsers } from '../../mock/data'

export default function UserManagement(){
  const { data, api } = useMockApi('hr:users', initialUsers)
  const [query, setQuery] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [sortBy, setSortBy] = useState('name')
  const [sortDir, setSortDir] = useState('asc')

  const filtered = useSearch(data, ['name', 'id', 'dept', 'role', 'contact', 'status'], query)
  const users = useSort(filtered, sortBy, sortDir)

  const totals = useMemo(() => ({
    total: data.length,
    active: data.filter(u => u.status === 'Active').length,
    inactive: data.filter(u => u.status !== 'Active').length,
    departments: new Set(data.map(u => u.dept)).size,
  }), [data])

  const toggleStatus = async (id) => {
    await api.update(u => u.id === id, (u) => ({ status: u.status === 'Active' ? 'Inactive' : 'Active' }))
  }
  const remove = async (id) => { await api.remove(u => u.id === id) }

  const onCreate = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const name = String(form.get('name') || '').trim()
    const dept = String(form.get('dept') || '').trim()
    const role = String(form.get('role') || '').trim()
    const contact = String(form.get('contact') || '').trim()
    if (!name || !dept || !role) return
    const id = `EMP${Math.floor(1000 + Math.random()*9000)}`
    await api.add({ id, name, dept, role, contact, status: 'Active' })
    setCreateOpen(false)
    e.currentTarget.reset()
  }

  const changeSort = (field) => {
    if (sortBy === field) setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    else { setSortBy(field); setSortDir('asc') }
  }

  return (
    <Layout portal="hr">
      <div className="hero">
        <div className="title">User Management</div>
        <div style={{display:'flex', gap:8}}>
          <input placeholder="Search users..." value={query} onChange={e=>setQuery(e.target.value)} />
          <button className="btn" onClick={()=>setCreateOpen(true)}>+ Add User</button>
        </div>
      </div>

      <div style={{marginTop:16}} className="grid cols-4">
        <div className="card"><div className="label">Total Employees</div><div style={{fontWeight:700,fontSize:20}}>{totals.total}</div></div>
        <div className="card"><div className="label">Active Users</div><div style={{fontWeight:700,fontSize:20}}>{totals.active}</div></div>
        <div className="card"><div className="label">Inactive Users</div><div style={{fontWeight:700,fontSize:20}}>{totals.inactive}</div></div>
        <div className="card"><div className="label">Departments</div><div style={{fontWeight:700,fontSize:20}}>{totals.departments}</div></div>
      </div>

      <div className="card" style={{marginTop:16}}>
        <table className="table">
          <thead>
            <tr>
              <th onClick={()=>changeSort('name')} style={{cursor:'pointer'}}>Employee</th>
              <th onClick={()=>changeSort('id')} style={{cursor:'pointer'}}>Employee ID</th>
              <th onClick={()=>changeSort('dept')} style={{cursor:'pointer'}}>Department</th>
              <th onClick={()=>changeSort('role')} style={{cursor:'pointer'}}>Role</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td style={{color:'#1f65ff',fontWeight:600}}>{u.id}</td>
                <td>{u.dept}</td>
                <td>{u.role}</td>
                <td>{u.contact}</td>
                <td><span className={`badge ${u.status === 'Active' ? 'success' : 'warning'}`}>{u.status}</span></td>
                <td>
                  <div className="actions">
                    <button onClick={()=>toggleStatus(u.id)}>{u.status === 'Active' ? '⏸' : '▶️'}</button>
                    <button onClick={()=>remove(u.id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={createOpen} title="Add User" onClose={()=>setCreateOpen(false)}>
        <form onSubmit={onCreate} style={{display:'grid', gap:8}}>
          <label className="label">Name</label>
          <input name="name" placeholder="Full name" />
          <label className="label">Department</label>
          <input name="dept" placeholder="Production" />
          <label className="label">Role</label>
          <input name="role" placeholder="Senior Operator" />
          <label className="label">Contact</label>
          <input name="contact" placeholder="+91 ..." />
          <div style={{display:'flex', gap:8, marginTop:8}}>
            <button type="submit" className="btn">Save</button>
            <button type="button" onClick={()=>setCreateOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}
