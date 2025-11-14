import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { showToast } from '../lib/toast'

type Doctor = {
  id: number
  first_name: string
  last_name: string
  specialty?: string
  phone?: string
  email?: string
}

export default function Doctors() {
  const [list, setList] = useState<Doctor[]>([])
  const [form, setForm] = useState<Partial<Doctor>>({})

  const refresh = async () => {
    try {
      const doctors = await api('/doctors')
      setList(doctors)
    } catch (err) {
      console.error(err)
      showToast('Failed to load doctors.', 'error')
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const handleChange = (field: keyof Doctor, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleAdd = async () => {
    if (!form.first_name || !form.last_name) {
      showToast("Please enter the doctor's first and last name.", 'error')
      return
    }

    try {
      await api('/doctors', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      showToast('Doctor added successfully.', 'success')
      setForm({})
      refresh()
    } catch (err) {
      console.error(err)
      showToast('Failed to add doctor.', 'error')
    }
  }

  const handleDelete = async (id: number) => {
    const ok = window.confirm('Are you sure you want to delete this doctor?')
    if (!ok) return

    try {
      await api(`/doctors/${id}`, { method: 'DELETE' })
      showToast('Doctor deleted.', 'success')
      refresh()
    } catch (err) {
      console.error(err)
      showToast('Failed to delete doctor.', 'error')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50 py-12">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Add Doctor</h2>
          <div className="grid gap-3">
            <input
              className="input"
              placeholder="First name"
              value={form.first_name || ''}
              onChange={e => handleChange('first_name', e.target.value)}
            />
            <input
              className="input"
              placeholder="Last name"
              value={form.last_name || ''}
              onChange={e => handleChange('last_name', e.target.value)}
            />
            <input
              className="input"
              placeholder="Specialty"
              value={form.specialty || ''}
              onChange={e => handleChange('specialty', e.target.value)}
            />
            <input
              className="input"
              placeholder="Phone"
              value={form.phone || ''}
              onChange={e => handleChange('phone', e.target.value)}
            />
            <input
              className="input"
              placeholder="Email"
              value={form.email || ''}
              onChange={e => handleChange('email', e.target.value)}
            />
            <button className="btn mt-1" type="button" onClick={handleAdd}>
              Add
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Doctor Records</h2>
          {list.length === 0 ? (
            <p className="text-sm text-slate-500">No doctors added yet.</p>
          ) : (
            <ul className="space-y-3">
              {list.map(d => (
                <li
                  key={d.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
                >
                  <div>
                    <div className="font-semibold">
                      {d.first_name} {d.last_name}
                    </div>
                    <div className="text-slate-600">
                      {d.specialty || 'No specialty'}
                    </div>
                    <div className="text-xs text-slate-500">
                      {d.phone || 'No phone'} • {d.email || 'No email'}
                    </div>
                  </div>
                  <button
                    className="text-red-600 text-xs"
                    type="button"
                    onClick={() => handleDelete(d.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
