import { useEffect, useState } from 'react'
import { api } from '../lib/api'

type Doctor = { id:number; first_name:string; last_name:string; specialty?:string; phone?:string; email?:string }

export default function Doctors(){
  const [list, setList] = useState<Doctor[]>([])
  const [d, setD] = useState<Partial<Doctor>>({})

  const refresh = async ()=> setList(await api('/doctors'))
  useEffect(()=>{ refresh() },[])

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Add Doctor</h2>
        <div className="grid gap-3">
          <input className="input" placeholder="First name" onChange={e=>setD({...d, first_name:e.target.value})}/>
          <input className="input" placeholder="Last name" onChange={e=>setD({...d, last_name:e.target.value})}/>
          <input className="input" placeholder="Specialty" onChange={e=>setD({...d, specialty:e.target.value})}/>
          <input className="input" placeholder="Phone" onChange={e=>setD({...d, phone:e.target.value})}/>
          <input className="input" placeholder="Email" onChange={e=>setD({...d, email:e.target.value})}/>
          <button className="btn" onClick={async()=>{ await api('/doctors',{method:'POST', body:JSON.stringify(d)}); setD({}); refresh() }}>Add</button>
        </div>
      </div>
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Doctor Records</h2>
        <ul className="space-y-3">
          {list.map(x=>(
            <li key={x.id} className="border rounded-xl p-3 flex justify-between items-center">
              <div>
                <div className="font-semibold">{x.first_name} {x.last_name}</div>
                <div className="text-sm text-slate-600">{x.specialty||'—'} • {x.phone||'—'} • {x.email||'—'}</div>
              </div>
              <button className="text-red-600" onClick={async()=>{ await api(`/doctors/${x.id}`,{method:'DELETE'}); refresh() }}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
