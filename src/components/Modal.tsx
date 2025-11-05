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
            className="absolute inset-0 bg-neutral/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className={`relative w-full overflow-hidden rounded-4xl border border-border bg-surface px-6 pb-6 pt-8 text-neutral shadow-card backdrop-blur-xl sm:px-8 ${widthClassName}`}
            initial={{ y: 36, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
            onClick={event => event.stopPropagation()}
          >
            <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
            <button
              type="button"
              onClick={onClose}
              className="absolute right-6 top-6 inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-muted transition hover:border-accent/40 hover:text-neutral"
            >
              Close
            </button>
            <div className="flex flex-col gap-5">
              {title ? (
                <div className="pr-4">
                  <h2 className="text-2xl font-semibold text-neutral">{title}</h2>
                  {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
                </div>
              ) : null}
              <div className="max-h-[65vh] overflow-y-auto pr-2">
                {children}
              </div>
              {footer ? <div className="border-t border-border pt-4">{footer}</div> : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
