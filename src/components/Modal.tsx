import { type ReactNode, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  widthClassName?: string
}

export const Modal = ({ open, onClose, title, subtitle, children, footer, widthClassName = 'max-w-lg' }: ModalProps) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <motion.div
            className="absolute inset-0 bg-[#050508]/92 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className={`relative w-full overflow-hidden rounded-[28px] border border-white/15 bg-[#0f1117] px-6 pb-6 pt-8 text-slate-100 shadow-[0_40px_120px_-65px_rgba(15,23,42,0.9)] backdrop-blur-xl ${widthClassName}`}
            initial={{ y: 36, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
            onClick={event => event.stopPropagation()}
          >
            <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/60 to-transparent" />
            <button
              type="button"
              onClick={onClose}
              className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-200 transition hover:border-sky-400/60 hover:bg-sky-400/10 hover:text-white"
            >
              Close
            </button>
            <div className="flex flex-col gap-5">
              {title ? (
                <div className="pr-4">
                  <h2 className="text-2xl font-semibold text-white">{title}</h2>
                  {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
                </div>
              ) : null}
              <div className="max-h-[65vh] overflow-y-auto pr-2">
                {children}
              </div>
              {footer ? <div className="border-t border-white/5 pt-4">{footer}</div> : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
