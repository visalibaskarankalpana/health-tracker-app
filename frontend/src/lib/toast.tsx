import { useEffect, useState } from 'react'

export type ToastType = 'success' | 'error' | 'info'

export type ToastMessage = {
  id: number
  text: string
  type: ToastType
}

type Listener = (toast: ToastMessage) => void

let listeners: Listener[] = []

// Call this from anywhere to show a toast
export function showToast(text: string, type: ToastType = 'info') {
  const toast: ToastMessage = {
    id: Date.now() + Math.random(),
    text,
    type,
  }
  listeners.forEach(listener => listener(toast))
}

// Internal hook used by the host component
export function useToastHost() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  useEffect(() => {
    const listener: Listener = toast => {
      setToasts(current => [...current, toast])

      // Auto-dismiss after 3.5s
      setTimeout(() => {
        setToasts(current => current.filter(t => t.id !== toast.id))
      }, 3500)
    }

    listeners.push(listener)
    return () => {
      listeners = listeners.filter(l => l !== listener)
    }
  }, [])

  return toasts
}

// Render this once near the top of the app
export function ToastHost() {
  const toasts = useToastHost()

  return (
    <div className="pointer-events-none fixed top-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`pointer-events-auto rounded-xl px-4 py-3 text-sm text-white shadow-lg ${
            t.type === 'success'
              ? 'bg-emerald-500'
              : t.type === 'error'
              ? 'bg-rose-500'
              : 'bg-slate-800'
          }`}
        >
          {t.text}
        </div>
      ))}
    </div>
  )
}
