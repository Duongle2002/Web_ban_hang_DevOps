import React, { useEffect, useState } from 'react'
import api from '../../services/api'

export default function UsersAdmin(){
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'User' })
  const [error, setError] = useState('')

  async function load(){
    setLoading(true)
    try{
      const res = await api.get('/admin/users')
      // when using adminController.manageUsers it may render HTML; prefer ApiUserController for now
      const data = Array.isArray(res.data) ? res.data : (res.data.users || res.data.data || [])
      setUsers(data)
    }catch(e){ setError(e.response?.data?.message||e.message) }
    finally{ setLoading(false) }
  }

  useEffect(()=>{ load() },[])

  function update(k){ return e => setForm(p=>({ ...p, [k]: e.target.value })) }

  async function createUser(e){
    e.preventDefault()
    setError('')
    try{
  await api.post('/admin/users', form)
      setForm({ name:'', email:'', password:'', role:'User' })
      load()
    }catch(e){ setError(e.response?.data?.message||e.message) }
  }

  async function remove(id){
    if(!window.confirm('Delete user?')) return
  try{ await api.delete(`/admin/users/${id}`); load() }catch(e){ setError(e.response?.data?.message||e.message) }
  }

  return (
    <div>
      <h4>Users</h4>
      {error && <div className='alert alert-danger'>{error}</div>}
      <form className='row g-2 mb-3' onSubmit={createUser}>
        <div className='col'><input className='form-control' placeholder='Name' value={form.name} onChange={update('name')} /></div>
        <div className='col'><input type='email' className='form-control' placeholder='Email' value={form.email} onChange={update('email')} /></div>
        <div className='col'><input type='password' className='form-control' placeholder='Password' value={form.password} onChange={update('password')} /></div>
        <div className='col'><select className='form-select' value={form.role} onChange={update('role')}><option>User</option><option>Admin</option></select></div>
        <div className='col-auto'><button className='btn btn-primary' type='submit'>Create</button></div>
      </form>
      {loading ? <div>Loading...</div> : (
        <div className='table-responsive'>
          <table className='table'>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th/></tr></thead>
            <tbody>
              {users.map(u=> (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td><button className='btn btn-sm btn-outline-danger' onClick={()=> remove(u._id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
