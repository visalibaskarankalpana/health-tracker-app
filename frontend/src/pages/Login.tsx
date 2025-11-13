
// import { useState } from 'react'
// import { api, 
//   // setToken, getToken
//  } from '../lib/api'
// import { useNavigate } from 'react-router-dom'

// export default function Login(){
//   const [username, setUsername] = useState('')
//   const [password, setPassword] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
//   const nav = useNavigate()

//   const submit = async (path: string) => {
//     try {
//       setLoading(true); setError('')
//       const { token } = await api(`/auth/${path}`, { method:'POST', body: JSON.stringify({ username, password })})
//       setToken(token)
//       nav('/')
//     } catch(e:any){ setError(e.message) } finally { setLoading(false) }
//   }

//   if (getToken()) { nav('/'); return null }

//   return (
//     <div className="max-w-md mx-auto mt-16 card">
//       <h1 className="text-2xl font-semibold mb-4">Login</h1>
//       {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-3">{error}</div>}
//       <label className="label">Username</label>
//       <input className="input mb-3" value={username} onChange={e=>setUsername(e.target.value)} />
//       <label className="label">Password</label>
//       <input className="input mb-6" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
//       <div className="flex gap-2">
//         <button className="btn" disabled={loading} onClick={()=>submit('login')}>Log in</button>
//         <button className="btn bg-slate-700 hover:bg-slate-800" disabled={loading} onClick={()=>submit('signup')}>Sign up</button>
//       </div>
//     </div>
//   )
// }
