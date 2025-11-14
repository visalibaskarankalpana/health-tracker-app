import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { showToast } from '../lib/toast'

type Patient = {
  id: number
  first_name: string
  last_name: string
  dob?: string
  phone?: string
  email?: string
  address?: string
}

type Record = {
  id: number
  date: string
  notes?: string
  height_in?: number
  weight_lb?: number
  diagnosis?: string
  doctor_id?: number | null
  patient_id: number
}

type Doctor = { id: number; first_name: string; last_name: string }

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [patientForm, setPatientForm] = useState<Partial<Patient>>({})
  const [selected, setSelected] = useState<Patient | null>(null)

  const [records, setRecords] = useState<Record[]>([])
  const [recordForm, setRecordForm] = useState<Partial<Record>>({})
  const [doctors, setDoctors] = useState<Doctor[]>([])

  // ---- helpers ---------------------------------------------------------

  const loadPatientsAndDoctors = async () => {
    try {
      const [pts, docs] = await Promise.all([api('/patients'), api('/doctors')])
      setPatients(pts)
      setDoctors(docs)
    } catch (err) {
      console.error(err)
      showToast('Failed to load patients.', 'error')
    }
  }

  const loadRecordsForSelected = async (patient: Patient | null) => {
    if (!patient) {
      setRecords([])
      return
    }
    try {
      const recs = await api(`/patient_records/${patient.id}`)
      setRecords(recs)
    } catch (err) {
      console.error(err)
      showToast('Failed to load patient records.', 'error')
    }
  }

  // ---- initial load ----------------------------------------------------

  useEffect(() => {
    loadPatientsAndDoctors()
  }, [])

  // whenever selected patient changes, fetch their records
  useEffect(() => {
    loadRecordsForSelected(selected)
  }, [selected])

  // ---- Patient CRUD ----------------------------------------------------

  const handlePatientChange = (field: keyof Patient, value: string) =>
    setPatientForm(prev => ({ ...prev, [field]: value }))

  const handleAddPatient = async () => {
    if (!patientForm.first_name || !patientForm.last_name) {
      showToast("Please enter the patient's first and last name.", 'error')
      return
    }

    try {
      await api('/patients', {
        method: 'POST',
        body: JSON.stringify(patientForm),
      })
      showToast('Patient added successfully.', 'success')
      setPatientForm({})
      await loadPatientsAndDoctors()
    } catch (err) {
      console.error(err)
      showToast('Failed to add patient.', 'error')
    }
  }

  const handleDeletePatient = async (id: number) => {
    const ok = window.confirm(
      'Delete this patient and their records? This cannot be undone.',
    )
    if (!ok) return

    try {
      await api(`/patients/${id}`, { method: 'DELETE' })
      showToast('Patient deleted.', 'success')
      if (selected?.id === id) {
        setSelected(null)
        setRecords([])
      }
      await loadPatientsAndDoctors()
    } catch (err) {
      console.error(err)
      showToast('Failed to delete patient.', 'error')
    }
  }

  // ---- Record CRUD -----------------------------------------------------

  const handleRecordChange = (field: keyof Record, value: any) =>
    setRecordForm(prev => ({ ...prev, [field]: value }))

  const handleAddRecord = async () => {
    if (!selected) {
      showToast('Select a patient first.', 'error')
      return
    }
    if (!recordForm.date) {
      showToast('Please choose a record date.', 'error')
      return
    }

    try {
      await api('/patient_records', {
        method: 'POST',
        body: JSON.stringify({
          ...recordForm,
          patient_id: selected.id,
        }),
      })
      showToast('Record added.', 'success')
      setRecordForm({})
      await loadRecordsForSelected(selected)
    } catch (err) {
      console.error(err)
      showToast('Failed to add record.', 'error')
    }
  }

  const handleDeleteRecord = async (rec: Record) => {
    if (!selected) return
    const ok = window.confirm('Delete this record?')
    if (!ok) return

    try {
      await api(`/patient_records/${rec.id}`, { method: 'DELETE' })
      showToast('Record deleted.', 'success')
      await loadRecordsForSelected(selected)
    } catch (err) {
      console.error(err)
      showToast('Failed to delete record.', 'error')
    }
  }

  // ---- JSX -------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50 py-12">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6">
        {/* LEFT: Add + list patients */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Add Patient</h2>
          <div className="grid gap-3">
            <input
              className="input"
              placeholder="First name"
              value={patientForm.first_name || ''}
              onChange={e => handlePatientChange('first_name', e.target.value)}
            />
            <input
              className="input"
              placeholder="Last name"
              value={patientForm.last_name || ''}
              onChange={e => handlePatientChange('last_name', e.target.value)}
            />
            <input
              className="input"
              type="date"
              value={patientForm.dob || ''}
              onChange={e => handlePatientChange('dob', e.target.value)}
            />
            <input
              className="input"
              placeholder="Phone"
              value={patientForm.phone || ''}
              onChange={e => handlePatientChange('phone', e.target.value)}
            />
            <input
              className="input"
              placeholder="Email"
              value={patientForm.email || ''}
              onChange={e => handlePatientChange('email', e.target.value)}
            />
            <input
              className="input"
              placeholder="Address"
              value={patientForm.address || ''}
              onChange={e => handlePatientChange('address', e.target.value)}
            />
            <button className="btn mt-1" type="button" onClick={handleAddPatient}>
              Add
            </button>
          </div>

          <h2 className="text-xl font-semibold mt-6 mb-3">Patients</h2>
          <ul className="space-y-2">
            {patients.map(pt => (
              <li
                key={pt.id}
                className={`cursor-pointer rounded-xl border px-4 py-3 text-sm ${
                  selected?.id === pt.id
                    ? 'border-blue-500 bg-blue-50/60'
                    : 'border-slate-200 bg-white'
                }`}
                onClick={() => setSelected(pt)}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold">
                      {pt.first_name} {pt.last_name}
                    </div>
                    <div className="text-xs text-slate-600">
                      {pt.phone || 'No phone'} • {pt.email || 'No email'}
                    </div>
                  </div>
                  <button
                    className="text-red-600 text-xs"
                    type="button"
                    onClick={e => {
                      e.stopPropagation()
                      handleDeletePatient(pt.id)
                    }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
            {patients.length === 0 && (
              <li className="text-sm text-slate-500">
                No patients added yet.
              </li>
            )}
          </ul>
        </div>

        {/* RIGHT: Records for selected patient */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Patient Records</h2>

          {!selected ? (
            <p className="text-sm text-slate-500">
              Select a patient on the left.
            </p>
          ) : (
            <>
              {/* Add record form */}
              <div className="grid md:grid-cols-2 gap-3 mb-3">
                <input
                  className="input"
                  type="date"
                  value={recordForm.date || ''}
                  onChange={e => handleRecordChange('date', e.target.value)}
                />
                <select
                  className="input"
                  value={recordForm.doctor_id ?? ''}
                  onChange={e =>
                    handleRecordChange(
                      'doctor_id',
                      e.target.value ? Number(e.target.value) : null,
                    )
                  }
                >
                  <option value="">Doctor (optional)</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.first_name} {d.last_name}
                    </option>
                  ))}
                </select>
                <input
                  className="input"
                  placeholder="Height (inches)"
                  value={recordForm.height_in ?? ''}
                  onChange={e =>
                    handleRecordChange(
                      'height_in',
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                />
                <input
                  className="input"
                  placeholder="Weight (pounds)"
                  value={recordForm.weight_lb ?? ''}
                  onChange={e =>
                    handleRecordChange(
                      'weight_lb',
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                />
                <input
                  className="input"
                  placeholder="Diagnosis"
                  value={recordForm.diagnosis || ''}
                  onChange={e =>
                    handleRecordChange('diagnosis', e.target.value)
                  }
                />
              </div>
              <textarea
                className="input mb-3"
                placeholder="Notes"
                value={recordForm.notes || ''}
                onChange={e => handleRecordChange('notes', e.target.value)}
              />
              <div className="flex justify-end">
                <button
                  className="btn"
                  type="button"
                  onClick={handleAddRecord}
                >
                  Add record
                </button>
              </div>

              {/* Existing records list */}
              <ul className="mt-6 space-y-3">
                {records.map(rec => (
                  <li
                    key={rec.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
                  >
                    <div>
                      <div className="font-semibold">
                        {rec.date} — {rec.diagnosis || 'No diagnosis'}
                      </div>
                      <div className="text-xs text-slate-600">
                        H: {rec.height_in ?? '—'} in • W:{' '}
                        {rec.weight_lb ?? '—'} lb
                      </div>
                      <div className="mt-1 whitespace-pre-wrap text-xs text-slate-700">
                        {rec.notes || 'No notes'}
                      </div>
                    </div>
                    <button
                      className="text-red-600 text-xs"
                      type="button"
                      onClick={() => handleDeleteRecord(rec)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
                {records.length === 0 && (
                  <li className="text-sm text-slate-500">
                    No records for this patient yet.
                  </li>
                )}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
