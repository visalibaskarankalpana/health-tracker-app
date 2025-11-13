import React, { createContext, useContext, useMemo, useState } from "react";

type ToastVariant = "success" | "error" | "info";
type Toast = { id: string; title: string; description?: string; variant: ToastVariant; };

type ToastContextType = {
  show: (args: { title: string; description?: string; variant?: ToastVariant; durationMs?: number }) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider />");
  return ctx;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show: ToastContextType["show"] = ({ title, description, variant = "success", durationMs = 3000 }) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, title, description, variant }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, durationMs);
  };

  const value = useMemo(() => ({ show }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[9999] flex w-[360px] max-w-[92vw] flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={[
              "rounded-xl shadow-lg border p-3 px-4 backdrop-blur bg-white/90",
              t.variant === "success" ? "border-emerald-200" : "",
              t.variant === "error" ? "border-rose-200" : "",
              t.variant === "info" ? "border-sky-200" : "",
            ].join(" ")}
          >
            <div className="flex items-start gap-3">
              <span
                className={[
                  "mt-1 inline-flex h-2.5 w-2.5 rounded-full",
                  t.variant === "success" ? "bg-emerald-500" : "",
                  t.variant === "error" ? "bg-rose-500" : "",
                  t.variant === "info" ? "bg-sky-500" : "",
                ].join(" ")}
              />
              <div className="flex-1">
                <div className="font-medium text-slate-800">{t.title}</div>
                {t.description ? (
                  <div className="text-sm text-slate-600">{t.description}</div>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
