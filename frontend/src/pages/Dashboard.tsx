// frontend/src/pages/Dashboard.tsx
import { Link } from "react-router-dom";
import {
  HeartIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ClockIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";

export default function Dashboard() {
  const features = [
    {
      icon: CalendarDaysIcon,
      title: "Easy Booking",
      description: "Schedule appointments in just a few clicks",
    },
    {
      icon: UserGroupIcon,
      title: "Expert Doctors",
      description: "Access to qualified healthcare professionals",
    },
    {
      icon: ClockIcon,
      title: "24/7 Support",
      description: "Round-the-clock customer assistance",
    },
    {
      icon: ShieldCheckIcon,
      title: "Secure & Private",
      description: "Your health data is protected",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-28 px-4">
        <div className="max-w-6xl lg:max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* LEFT: text + buttons */}
            <div>
              {/* pill */}
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
                <HeartIcon className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Trusted by 50,000+ patients
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Your Health, Our Priority
              </h1>

              <p className="text-lg text-slate-600 mb-8 max-w-xl">
                Book appointments quickly, track records, and manage your care
                team in one colorful, friendly workspace. Quality healthcare is
                just a click away.
              </p>

              <div className="flex flex-wrap gap-4">
                {/* primary CTA */}
                <Link
                  to="/appointments"
                  className="inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 px-8 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  Book Appointment
                </Link>

                {/* secondary CTA */}
                <Link
                  to="/my-appointments"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-blue-400 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  My Appointments
                </Link>
              </div>
            </div>

            {/* RIGHT: hero image + 500+ card */}
            <div className="relative">
              <div className="rounded-3xl shadow-2xl overflow-hidden w-full">
                <img
                  className="w-full h-full object-cover"
                  alt="Doctor consulting with patient in modern medical office"
                  src="https://images.unsplash.com/photo-1675270714610-11a5cadcc7b3"
                />
              </div>

              {/* 500+ Certified Doctors card */}
              <div className="absolute -bottom-8 left-6 bg-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3">
                <div className="bg-emerald-100 p-3 rounded-full">
                  <ShieldCheckIcon className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-bold text-2xl text-slate-900">500+</p>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Certified Doctors
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl lg:max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Choose HealthCare?
            </h2>
            <p className="text-lg text-gray-600">
              Experience healthcare booking like never before
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
