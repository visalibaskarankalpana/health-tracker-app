import { useEffect, useState } from 'react'
import { api } from '../lib/api'

type Patient = { id:number; first_name:string; last_name:string; dob?:string; phone?:string; email?:string; address?:string }
type Record = { id:number; date:string; notes?:string; height_in?:number; weight_lb?:number; diagnosis?:string; doctor_id?:number|null; patient_id:number }
type Doctor = { id:number; first_name:string; last_name:string }

export default function Patients(){
  const [patients, setPatients] = useState<Patient[]>([])
  const [p, setP] = useState<Partial<Patient>>({})
  const [selected, setSelected] = useState<Patient | null>(null)

  const [records, setRecords] = useState<Record[]>([])
  const [r, setR] = useState<Partial<Record>>({})
  const [doctors, setDoctors] = useState<Doctor[]>([])

  const refresh = async ()=>{
    setPatients(await api('/patients'))
    setDoctors(await api('/doctors'))
    if(selected) setRecords(await api(`/patient_records/${selected.id}`))
  }
  useEffect(()=>{ refresh() },[])
  useEffect(()=>{ (async()=>{ if(selected){ setRecords(await api(`/patient_records/${selected.id}`)) } })() },[selected])

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Add Patient</h2>
        <div className="grid gap-3">
          <input className="input" placeholder="First name" onChange={e=>setP({...p, first_name:e.target.value})}/>
          <input className="input" placeholder="Last name" onChange={e=>setP({...p, last_name:e.target.value})}/>
          <input className="input" type="date" onChange={e=>setP({...p, dob:e.target.value})}/>
          <input className="input" placeholder="Phone" onChange={e=>setP({...p, phone:e.target.value})}/>
          <input className="input" placeholder="Email" onChange={e=>setP({...p, email:e.target.value})}/>
          <input className="input" placeholder="Address" onChange={e=>setP({...p, address:e.target.value})}/>
          <button className="btn" onClick={async()=>{ await api('/patients',{method:'POST', body:JSON.stringify(p)}); setP({}); refresh() }}>Add</button>
        </div>
        <h2 className="text-xl font-semibold mt-6 mb-3">Patients</h2>
        <ul className="space-y-2">
          {patients.map(pt=>(
            <li key={pt.id}
              className={`border rounded-xl p-3 cursor-pointer ${selected?.id===pt.id?'border-blue-500':''}`}
              onClick={()=>setSelected(pt)}>
              <div className="font-semibold">{pt.first_name} {pt.last_name}</div>
              <div className="text-sm text-slate-600">{pt.phone||'—'} • {pt.email||'—'}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Patient Records</h2>
        {!selected ? <p className="text-slate-500">Select a patient on the left.</p> : (
          <>
            <div className="grid md:grid-cols-2 gap-3 mb-3">
              <input className="input" type="date" onChange={e=>setR({...r, date:e.target.value, patient_id:selected.id})}/>
              <select className="input" onChange={e=>setR({...r, doctor_id: e.target.value? Number(e.target.value): undefined, patient_id:selected.id})}>
                <option value="">Doctor (optional)</option>
                {doctors.map(d=><option key={d.id} value={d.id}>{d.first_name} {d.last_name}</option>)}
              </select>
              <input className="input" placeholder="Height (inches)" onChange={e=>setR({...r, height_in:Number(e.target.value), patient_id:selected.id})}/>
              <input className="input" placeholder="Weight (pounds)" onChange={e=>setR({...r, weight_lb:Number(e.target.value), patient_id:selected.id})}/>
              <input className="input" placeholder="Diagnosis" onChange={e=>setR({...r, diagnosis:e.target.value, patient_id:selected.id})}/>
            </div>
            <textarea className="input mb-3" placeholder="Notes" onChange={e=>setR({...r, notes:e.target.value, patient_id:selected.id})}/>
            <div className="flex justify-end">
              <button className="btn" onClick={async()=>{ await api('/patient_records',{method:'POST', body:JSON.stringify(r)}); setR({}); setRecords(await api(`/patient_records/${selected.id}`)) }}>Add record</button>
            </div>

            <ul className="mt-6 space-y-3">
              {records.map(rec=>(
                <li key={rec.id} className="border rounded-xl p-3 flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{rec.date} — {rec.diagnosis||'—'}</div>
                    <div className="text-sm text-slate-600">H: {rec.height_in??'—'} in • W: {rec.weight_lb??'—'} lb</div>
                    <div className="text-sm text-slate-700 mt-1 whitespace-pre-wrap">{rec.notes||'—'}</div>
                  </div>
                  <button className="text-red-600" onClick={async()=>{ await api(`/patient_records/${rec.id}`,{method:'DELETE'}); setRecords(await api(`/patient_records/${selected.id}`)) }}>Delete</button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
