import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

import App from './pages/App'
import Dashboard from './pages/Dashboard'
import Appointments from './pages/Appointments'
import MyAppointments from './pages/MyAppointments'
import Doctors from './pages/Doctors'
import Patients from './pages/Patients'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'appointments', element: <Appointments /> },
      { path: 'my-appointments', element: <MyAppointments /> },
      { path: 'doctors', element: <Doctors /> },
      { path: 'patients', element: <Patients /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
