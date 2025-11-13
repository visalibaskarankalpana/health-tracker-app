import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { CalendarDaysIcon, PhoneIcon, UserIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

type Appointment = { id:number; date:string; time?:string; purpose?:string; doctor_id?:number|null; patient_id?:number|null }
type Doctor = { id:number; first_name:string; last_name:string }
type Patient = { id:number; first_name:string; last_name:string }

export default function Appointments() {
  const [list, setList] = useState<Appointment[]>([]);
  const [form, setForm] = useState<Partial<Appointment>>({});
  const [docs, setDocs] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);

  const refresh = async () => {
    setList(await api("/appointments"))
    setDocs(await api("/doctors"))
    setPatients(await api("/patients"))
  }
  useEffect(()=>{ refresh() },[])

  const handleChange = (field: string, value: any) => setForm({ ...form, [field]: value })

  const handleSubmit = async () => {
    await api("/appointments", { method:"POST", body: JSON.stringify(form) })
    setForm({})
    refresh()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">Book an Appointment</h1>
        <p className="text-slate-600 mb-8">Fill in your details to schedule your visit</p>

        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-sm font-medium mb-1 text-slate-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <UserIcon className="h-5 w-5 text-blue-500 absolute left-3 top-3" />
                <input type="text" className="input pl-10" placeholder="John Doe" onChange={e=>handleChange("full_name", e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Email <span className="text-red-500">*</span></label>
              <div className="relative">
                <EnvelopeIcon className="h-5 w-5 text-blue-500 absolute left-3 top-3" />
                <input type="email" className="input pl-10" placeholder="john@example.com" onChange={e=>handleChange("email", e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Phone Number <span className="text-red-500">*</span></label>
              <div className="relative">
                <PhoneIcon className="h-5 w-5 text-blue-500 absolute left-3 top-3" />
                <input type="tel" className="input pl-10" placeholder="+1 (555) 000-0000" onChange={e=>handleChange("phone", e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Department <span className="text-red-500">*</span></label>
              <select className="input" onChange={e=>handleChange("department", e.target.value)}>
                <option value="">Select department</option>
                <option>Cardiology</option>
                <option>General Medicine</option>
                <option>Pediatrics</option>
                <option>Neurology</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Appointment Date <span className="text-red-500">*</span></label>
              <div className="relative">
                <CalendarDaysIcon className="h-5 w-5 text-blue-500 absolute left-3 top-3" />
                <input type="date" className="input pl-10" onChange={e=>handleChange("date", e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Preferred Time <span className="text-red-500">*</span></label>
              <input type="time" className="input" onChange={e=>handleChange("time", e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Preferred Doctor (Optional)</label>
              <select className="input" onChange={e=>handleChange("doctor_id", e.target.value ? Number(e.target.value) : undefined)}>
                <option value="">Select doctor</option>
                {docs.map(d=> <option key={d.id} value={d.id}>{d.first_name} {d.last_name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Patient (Optional)</label>
              <select className="input" onChange={e=>handleChange("patient_id", e.target.value ? Number(e.target.value) : undefined)}>
                <option value="">Select patient</option>
                {patients.map(p=> <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Reason for Visit (Optional)</label>
            <textarea className="input" placeholder="Please describe your symptoms or reason for visit..." onChange={e=>handleChange("purpose", e.target.value)} />
          </div>

          <div className="flex justify-end gap-3">
            <button className="btn-ghost" type="button" onClick={()=>setForm({})}>Cancel</button>
            <button className="btn" onClick={handleSubmit}>Book Appointment</button>
          </div>
        </div>
      </div>
    </div>
  )
}
