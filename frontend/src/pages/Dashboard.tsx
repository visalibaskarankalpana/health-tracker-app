


import { Link } from 'react-router-dom'

export default function Dashboard(){
  return (
    <div className="space-y-12">
      <section className="grid gap-10 md:grid-cols-2 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm">
            ✨ All-in-one health
          </div>

          <h1 className="mt-4 text-[44px] leading-[1.1] font-extrabold tracking-tight md:text-6xl">
            Your Health, <span className="text-primary">Our Priority</span>
          </h1>

          <p className="mt-4 text-slate-600 text-lg max-w-xl">
            Book appointments quickly, track records, and manage your care team in one colorful, friendly workspace.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <Link to="/appointments" className="btn">Book Appointment</Link>
            <Link to="/my-appointments" className="btn btn-outline">My Appointments</Link>
          </div>
        </div>

        <div className="rounded-3xl bg-white shadow-[0_20px_60px_rgba(2,6,23,0.08)] p-3">
          <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1675270714610-11a5cadcc7b3"
              alt="Doctor with patient"
              className="h-full w-full object-cover"
              loading="eager"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
