
import { useEffect, useState } from 'react'
import { api } from '../lib/api'

type Appointment = { id:number; date:string; time?:string; purpose?:string }

export default function MyAppointments(){
  const [list, setList] = useState<Appointment[]>([])
  const refresh = async ()=> setList(await api('/appointments'))
  useEffect(()=>{ refresh() },[])

  return (
    <div className="max-w-3xl mx-auto card">
      <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
      {list.length===0 ? <p className="text-slate-500">No upcoming appointments.</p> :
        <ul className="space-y-3">
          {list.map(a=>(
            <li key={a.id} className="border rounded-xl p-3 flex justify-between items-center">
              <div>
                <div className="font-semibold">{a.date} {a.time||''}</div>
                <div className="text-sm text-slate-600">{a.purpose||'—'}</div>
              </div>
              <button className="text-red-600" onClick={async()=>{ await api(`/appointments/${a.id}`,{method:'DELETE'}); refresh() }}>Cancel</button>
            </li>
          ))}
        </ul>
      }
    </div>
  )
}
