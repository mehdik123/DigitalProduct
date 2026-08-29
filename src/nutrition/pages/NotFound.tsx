import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Compass } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="bg-app relative flex min-h-dvh items-center justify-center overflow-hidden px-5 text-txt-hi">
      <div className="ambient-grid pointer-events-none absolute inset-0 opacity-30" />

      <div className="relative z-10 w-full max-w-sm text-center">
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl border border-hair bg-surface-2 text-brand">
          <Compass className="h-6 w-6" />
        </div>

        <h1 className="font-display text-display-lg font-black uppercase italic tracking-tight">404</h1>
        <p className="mt-1 text-xs font-bold uppercase tracking-[0.25em] text-txt-lo">
          Page not found
        </p>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-grad-red text-xs font-black uppercase tracking-[0.2em] text-white shadow-red active:scale-[0.98]"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          Back to home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
