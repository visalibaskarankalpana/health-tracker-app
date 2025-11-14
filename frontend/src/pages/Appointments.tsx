// frontend/src/pages/Appointments.tsx
import { useState, useEffect } from "react";
import { api } from "../lib/api";
import {
  CalendarDaysIcon,
  PhoneIcon,
  UserIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

type Appointment = {
  id: number;
  date: string;
  time?: string;
  purpose?: string;
  doctor_id?: number | null;
  patient_id?: number | null;
};

type Doctor = { id: number; first_name: string; last_name: string };
type Patient = { id: number; first_name: string; last_name: string };

type AppointmentForm = {
  full_name?: string;
  email?: string;
  phone?: string;
  department?: string;
  date?: string;
  time?: string;
  purpose?: string;
  doctor_id?: number | null;
  patient_id?: number | null;
};

export default function Appointments() {
  const [list, setList] = useState<Appointment[]>([]);
  const [form, setForm] = useState<AppointmentForm>({});
  const [docs, setDocs] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);

  const refresh = async () => {
    try {
      const [appointments, doctors, pts] = await Promise.all([
        api("/appointments"),
        api("/doctors"),
        api("/patients"),
      ]);
      setList(appointments);
      setDocs(doctors);
      setPatients(pts);
    } catch (err) {
      console.error(err);
      alert("Failed to load data.");
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleChange = (field: keyof AppointmentForm, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const resetForm = () => setForm({});

  const handleSubmit = async () => {
    // basic front-end validation
    const required: (keyof AppointmentForm)[] = [
      "full_name",
      "email",
      "phone",
      "department",
      "date",
      "time",
    ];
    const missing = required.filter((f) => !form[f]);
    if (missing.length) {
      alert("Please fill in all required fields.");
      return;
    }

    const payload = {
      date: form.date!,
      time: form.time!,
      purpose: form.purpose || "",
      doctor_id: form.doctor_id ?? null,
      patient_id: form.patient_id ?? null,
      full_name: form.full_name,
      email: form.email,
      phone: form.phone,
      department: form.department,
    };

    try {
      await api("/appointments", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      alert("Appointment booked successfully!");
      resetForm();
      refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to book appointment. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">
          Book an Appointment
        </h1>
        <p className="text-slate-600 mb-8">
          Fill in your details to schedule your visit
        </p>

        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <UserIcon
                  className="h-5 w-5 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                />
                <input
                  type="text"
                  className="input pl-10"
                  placeholder="John Doe"
                  value={form.full_name || ""}
                  onChange={(e) => handleChange("full_name", e.target.value)}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <EnvelopeIcon
                  className="h-5 w-5 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                />
                <input
                  type="email"
                  className="input pl-10"
                  placeholder="john@example.com"
                  value={form.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <PhoneIcon
                  className="h-5 w-5 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                />
                <input
                  type="tel"
                  className="input pl-10"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone || ""}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                className="input"
                value={form.department || ""}
                onChange={(e) => handleChange("department", e.target.value)}
              >
                <option value="">Select department</option>
                <option>Cardiology</option>
                <option>General Medicine</option>
                <option>Pediatrics</option>
                <option>Neurology</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">
                Appointment Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <CalendarDaysIcon
                  className="h-5 w-5 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                />
                <input
                  type="date"
                  className="input pl-10"
                  value={form.date || ""}
                  onChange={(e) => handleChange("date", e.target.value)}
                />
              </div>
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">
                Preferred Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                className="input"
                value={form.time || ""}
                onChange={(e) => handleChange("time", e.target.value)}
              />
            </div>

            {/* Doctor (optional) */}
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">
                Preferred Doctor (Optional)
              </label>
              <select
                className="input"
                value={form.doctor_id ?? ""}
                onChange={(e) =>
                  handleChange(
                    "doctor_id",
                    e.target.value ? Number(e.target.value) : null,
                  )
                }
              >
                <option value="">Select doctor</option>
                {docs.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.first_name} {d.last_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Patient (optional) */}
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">
                Patient (Optional)
              </label>
              <select
                className="input"
                value={form.patient_id ?? ""}
                onChange={(e) =>
                  handleChange(
                    "patient_id",
                    e.target.value ? Number(e.target.value) : null,
                  )
                }
              >
                <option value="">Select patient</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.first_name} {p.last_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">
              Reason for Visit (Optional)
            </label>
            <textarea
              className="input"
              placeholder="Please describe your symptoms or reason for visit..."
              value={form.purpose || ""}
              onChange={(e) => handleChange("purpose", e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="btn-ghost"
              onClick={resetForm}
            >
              Cancel
            </button>
            <button className="btn" type="button" onClick={handleSubmit}>
              Book Appointment
            </button>
          </div>
        </div>

        {/* optional: show upcoming appointments list */}
        {list.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-3 text-slate-800">
              Upcoming appointments
            </h2>
            <ul className="space-y-2">
              {list.map((a) => (
                <li
                  key={a.id}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
                >
                  <div className="font-medium">
                    {a.date} {a.time && `• ${a.time}`}
                  </div>
                  <div>{a.purpose || "No reason given."}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
