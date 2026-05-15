import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette } from 'lucide-react'

const NAV_LINKS = ['Produkte', 'Benefit-Plattform', 'Warum Benefits?', 'Hilfe & FAQ', 'Kontakt']

const NAV_THEMES = {
  grau:    { text: '#494949', logoColor: '#494949', btnText: '#494949', navBtnBg: '#E8FE42', navBtnShadow: 'rgba(169, 186, 44, 1)' },
  violett: { text: '#48444F', logoColor: '#5F4A8B', btnText: '#443563', navBtnBg: '#E8FE42', navBtnShadow: 'rgba(169, 186, 44, 1)' },
  gruen:   { text: '#362A4D', logoColor: '#362A4D', btnText: '#362A4D', navBtnBg: '#B8FF6F', navBtnShadow: 'rgba(107, 145, 67, 1)' },
  hell:    { text: '#362A4D', logoColor: '#362A4D', btnText: '#362A4D', navBtnBg: '#B8FF6F', navBtnShadow: 'rgba(107, 145, 67, 1)' },
}

const THEME_OPTIONS = [
  { key: 'grau',    label: 'Yellow-Gray',   swatches: ['#E8FE42', '#494949'], activeBg: '#494949' },
  { key: 'violett', label: 'Yellow-Purple',  swatches: ['#E8FE42', '#443563'], activeBg: '#443563' },
  { key: 'gruen',   label: 'Green-Purple',   swatches: ['#B8FF6F', '#362A4D'], activeBg: '#362A4D' },
  { key: 'hell',    label: 'Green-Purple Freisteller', swatches: ['#B8FF6F', '#362A4D'], activeBg: '#362A4D' },
]

function ThemeDropdown({ variant, setVariant }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="hs-theme-dropdown" ref={ref}>
      <motion.button
        className="hs-palette-btn"
        onClick={() => setOpen(v => !v)}
        animate={{
          backgroundColor: open ? 'rgba(232, 254, 66, 0.9)' : 'rgba(0,0,0,0.06)',
          color: '#494949',
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        aria-label="Farbthema wählen"
        title="Farbthema wählen"
      >
        <Palette size={18} strokeWidth={2} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="hs-theme-menu"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            {THEME_OPTIONS.map(opt => (
              <button
                key={opt.key}
                className={`hs-theme-option${variant === opt.key ? ' hs-theme-option--active' : ''}`}
                style={variant === opt.key ? { backgroundColor: opt.activeBg } : undefined}
                onClick={() => { setVariant(opt.key); setOpen(false) }}
              >
                <div className="hs-theme-swatches">
                  {opt.swatches.map((color, i) => (
                    <span key={i} className="hs-swatch" style={{ background: color }} />
                  ))}
                </div>
                <span className="hs-theme-label">{opt.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Navbar({ variant, setVariant }) {
  const [open, setOpen] = useState(false)
  const theme = NAV_THEMES[variant] ?? NAV_THEMES.grau

  return (
    <div className="hs-nav-wrapper">
      <nav className="hs-nav">
        <motion.div
          className="hs-nav-logo"
          animate={{ color: theme.logoColor }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          aria-label="Spendit"
        />

        {/* Desktop Links */}
        <ul className="hs-nav-links">
          {NAV_LINKS.map(l => (
            <li key={l}>
              <a href="#" className="hs-nav-link" style={{ color: theme.text }} data-text={l}>{l}</a>
            </li>
          ))}
        </ul>

        {/* Dropdown + CTA */}
        <div className="hs-nav-right">
          <ThemeDropdown variant={variant} setVariant={setVariant} />

          <motion.a
            href="#"
            className="hs-nav-btn"
            animate={{ color: theme.btnText, backgroundColor: theme.navBtnBg }}
            initial={{ boxShadow: '0px 0px 0px 0px rgba(0,0,0,0)' }}
            whileHover={{ x: -3, y: -3, boxShadow: `6px 8px 0px 0px ${theme.navBtnShadow}` }}
            whileTap={{ x: -1, y: -1, boxShadow: `2px 3px 0px 0px ${theme.navBtnShadow}` }}
            transition={{ type: 'spring', stiffness: 320, damping: 22, color: { duration: 0.4, ease: 'easeInOut' }, backgroundColor: { duration: 0.4, ease: 'easeInOut' } }}
          >
            Termin Buchen
          </motion.a>
        </div>

        {/* Mobile: ThemeDropdown + Burger */}
        <div className="hs-mobile-controls">
          <ThemeDropdown variant={variant} setVariant={setVariant} />
          <button className="hs-burger" onClick={() => setOpen(v => !v)} aria-label="Menü">
            <motion.span className="hs-burger-line" animate={{ rotate: open ? 45 : 0, y: open ? 7 : 0 }} transition={{ duration: 0.2 }} />
            <motion.span className="hs-burger-line" animate={{ opacity: open ? 0 : 1 }} transition={{ duration: 0.15 }} />
            <motion.span className="hs-burger-line" animate={{ rotate: open ? -45 : 0, y: open ? -7 : 0 }} transition={{ duration: 0.2 }} />
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            style={{ overflow: 'hidden' }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1, transition: { height: { duration: 0.42, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.28, ease: 'easeOut' } } }}
            exit={{ height: 0, opacity: 0, transition: { height: { duration: 0.32, ease: [0.4, 0, 0.8, 0] }, opacity: { duration: 0.22, ease: 'easeIn' } } }}
          >
            <div className="hs-mobile-menu">
              {NAV_LINKS.map(l => (
                <a key={l} href="#" className="hs-mobile-link" style={{ color: theme.text }}>{l}</a>
              ))}
              <div className="hs-mobile-footer">
                <a href="#" className="hs-nav-btn" style={{ backgroundColor: theme.navBtnBg, color: theme.btnText }}>Termin Buchen</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
