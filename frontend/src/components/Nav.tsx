import { Link, useLocation } from 'react-router-dom'
import { ToastHost } from '../lib/toast'

const links = [
  ['/', 'Home'],
  ['/appointments', 'Book Appointment'],
  ['/my-appointments', 'My Appointments'],
  ['/doctors', 'Doctors'],
  ['/patients', 'Patients'],
] as const

export default function Nav() {
  const { pathname } = useLocation()

  return (
    <>
      <header className="bg-white/90 backdrop-blur border-b border-slate-100">
        <nav className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl text-primary"
          >
            <span role="img" aria-label="heart">
              ⚕️
            </span>
            <span>HealthConnect</span>
          </Link>

          <div className="hidden md:flex gap-5">
            {links.map(([href, label]) => (
              <Link
                key={href}
                to={href}
                className={`text-sm ${
                  pathname === href
                    ? 'text-primary font-semibold'
                    : 'text-slate-600 hover:text-primary'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          <Link to="/appointments" className="btn hidden sm:inline-flex">
            Book Now
          </Link>
        </nav>
      </header>

      {/* Global toast overlay */}
      <ToastHost />
    </>
  )
}
