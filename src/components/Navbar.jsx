import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette } from 'lucide-react'

const NAV_LINKS = ['Produkte', 'Benefit-Plattform', 'Warum Benefits?', 'Hilfe & FAQ', 'Kontakt']

const NAV_THEMES = {
  grau:    { text: '#494949', logoColor: '#494949', btnText: '#494949' },
  violett: { text: '#48444F', logoColor: '#5F4A8B', btnText: '#443563' },
}

function ColorToggle({ variant, setVariant }) {
  const isViolett = variant === 'violett'
  return (
    <motion.button
      className="hs-palette-btn"
      onClick={() => setVariant(v => v === 'grau' ? 'violett' : 'grau')}
      animate={{
        backgroundColor: isViolett ? '#443563' : 'rgba(0,0,0,0.06)',
        color: isViolett ? '#ffffff' : '#494949',
      }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      aria-label="Farbvariante wechseln"
      title={isViolett ? 'Violett aktiv' : 'Grau aktiv'}
    >
      <Palette size={18} strokeWidth={2} />
    </motion.button>
  )
}

export default function Navbar({ variant, setVariant }) {
  const [open, setOpen] = useState(false)
  const theme = NAV_THEMES[variant]

  return (
    <>
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

        {/* Toggle + CTA */}
        <div className="hs-nav-right">
          <ColorToggle variant={variant} setVariant={setVariant} />

          <motion.a
            href="#"
            className="hs-nav-btn"
            animate={{ color: theme.btnText }}
            initial={{ boxShadow: '0px 0px 0px 0px rgba(169,186,44,0)' }}
            whileHover={{ x: -3, y: -3, boxShadow: '6px 8px 0px 0px rgba(169,186,44,1)' }}
            whileTap={{ x: -1, y: -1, boxShadow: '2px 3px 0px 0px rgba(169,186,44,1)' }}
            transition={{ type: 'spring', stiffness: 320, damping: 22, color: { duration: 0.4, ease: 'easeInOut' } }}
          >
            Termin Buchen
          </motion.a>
        </div>

        {/* Mobile Burger */}
        <button className="hs-burger" onClick={() => setOpen(v => !v)} aria-label="Menü">
          <motion.span className="hs-burger-line" animate={{ rotate: open ? 45 : 0, y: open ? 7 : 0 }} transition={{ duration: 0.2 }} />
          <motion.span className="hs-burger-line" animate={{ opacity: open ? 0 : 1 }} transition={{ duration: 0.15 }} />
          <motion.span className="hs-burger-line" animate={{ rotate: open ? -45 : 0, y: open ? -7 : 0 }} transition={{ duration: 0.2 }} />
        </button>
      </nav>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="hs-mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {NAV_LINKS.map(l => (
              <a key={l} href="#" className="hs-mobile-link" style={{ color: theme.text }}>{l}</a>
            ))}
            <div className="hs-mobile-footer">
              <a href="#" className="hs-nav-btn">Termin Buchen</a>
              <ColorToggle variant={variant} setVariant={setVariant} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
