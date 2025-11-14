import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { showToast } from '../lib/toast'

type Appointment = {
  id: number
  date: string
  time?: string
  purpose?: string
}

export default function MyAppointments() {
  const [list, setList] = useState<Appointment[]>([])

  const refresh = async () => {
    try {
      const appointments = await api('/appointments')
      setList(appointments)
    } catch (err) {
      console.error(err)
      showToast('Failed to load appointments.', 'error')
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const handleCancel = async (id: number) => {
    const ok = window.confirm('Cancel this appointment?')
    if (!ok) return

    try {
      await api(`/appointments/${id}`, { method: 'DELETE' })
      showToast('Appointment cancelled.', 'success')
      refresh()
    } catch (err) {
      console.error(err)
      showToast('Failed to cancel appointment.', 'error')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50 py-12">
      <div className="max-w-3xl mx-auto card">
        <h1 className="text-2xl font-semibold mb-4">My Appointments</h1>
        {list.length === 0 ? (
          <p className="text-slate-500 text-sm">
            You don&apos;t have any upcoming appointments.
          </p>
        ) : (
          <ul className="space-y-3">
            {list.map(a => (
              <li
                key={a.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
              >
                <div>
                  <div className="font-semibold">
                    {a.date} {a.time && `• ${a.time}`}
                  </div>
                  <div className="text-slate-600">
                    {a.purpose || 'No reason given.'}
                  </div>
                </div>
                <button
                  className="text-red-600 text-xs"
                  type="button"
                  onClick={() => handleCancel(a.id)}
                >
                  Cancel
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
