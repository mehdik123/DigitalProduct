import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, PlayCircle } from 'lucide-react';
import { getYouTubeEmbedUrl } from '../../lib/youtube';

interface VideoModalProps {
  open: boolean;
  onClose: () => void;
  videoUrl?: string | null;
  title?: string;
}

export function VideoModal({ open, onClose, videoUrl, title }: VideoModalProps) {
  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-hair bg-surface-1 shadow-soft"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-hair px-4 py-3">
              <div className="flex min-w-0 items-center gap-2">
                <PlayCircle className="h-4 w-4 shrink-0 text-brand" />
                <span className="truncate font-display text-sm font-black uppercase italic tracking-tight text-txt-hi">
                  {title || 'Video'}
                </span>
              </div>
              <button
                type="button"
                aria-label="close"
                onClick={onClose}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-hair bg-surface-2 text-txt-mid transition-colors hover:text-txt-hi"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative aspect-video w-full bg-black">
              {embedUrl ? (
                <iframe
                  key={embedUrl}
                  className="absolute inset-0 h-full w-full"
                  src={embedUrl}
                  title={title || 'Exercise video'}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-sm text-txt-lo">
                  Video unavailable
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
