import { Outlet } from 'react-router-dom'
import Nav from '../components/Nav'

export default function App() {
  return (
    <div>
      <Nav />
      {/* Wider container, a little less vertical padding */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}


