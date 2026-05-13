import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const SPRING = { stiffness: 80, damping: 20, mass: 1 }
const COLOR_TRANSITION = { duration: 0.4, ease: 'easeInOut' }

const THEMES = {
  grau:    { textboxBg: 'rgba(61, 61, 61, 0.8)',  btnText: '#494949' },
  violett: { textboxBg: 'rgba(68, 53, 99, 0.8)',  btnText: '#443563' },
}

export default function Herostage({ variant }) {
  const theme = THEMES[variant] ?? THEMES.grau
  const ref = useRef(null)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, SPRING)
  const y = useSpring(rawY, SPRING)

  const bgX   = useTransform(x, v => v * 0.006)
  const bgY   = useTransform(y, v => v * 0.006)
  const plusX = useTransform(x, v => v * 0.018)
  const plusY = useTransform(y, v => v * 0.018)
  const freiX = useTransform(x, v => v * 0.032)
  const freiY = useTransform(y, v => v * 0.032)

  function handleMouseMove(e) {
    const r = ref.current.getBoundingClientRect()
    rawX.set(e.clientX - r.left - r.width / 2)
    rawY.set(e.clientY - r.top - r.height / 2)
  }

  function handleMouseLeave() {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <div ref={ref} className="hs" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>

      {/* Layer 1: Hintergrund */}
      <motion.div className="hs-fill" style={{ x: bgX, y: bgY }}>
        <img src="/assets/bg.png" alt="" className="hs-img" />
      </motion.div>

      {/* Layer 2: Plus SVG */}
      <motion.div className="hs-plus" style={{ x: plusX, y: plusY }}>
        <img src="/assets/plus.svg" alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
      </motion.div>

      {/* Layer 3: Freisteller */}
      <motion.div className="hs-fill hs-fill-frei" style={{ x: freiX, y: freiY }}>
        <img src="/assets/freisteller.png" alt="" className="hs-img hs-frei" />
      </motion.div>

      {/* Layer 4: Textbox */}
      <motion.div
        className="hs-textbox"
        animate={{ backgroundColor: theme.textboxBg }}
        transition={COLOR_TRANSITION}
      >
        <div className="hs-copy">
          <h1 className="hs-headline">
            Benefits, die sich nach{' '}
            <span style={{ color: '#E8FE42' }}>Lifestyle</span> anfühlen.
          </h1>
          <p className="hs-body">
            Keine starren Gutscheine, sondern die Freiheit, selbst zu wählen.
          </p>
        </div>

        <motion.button
          className="hs-btn"
          animate={{ color: theme.btnText }}
          initial={{ boxShadow: '0px 0px 0px 0px rgba(170, 186, 44, 0)' }}
          whileHover={{ x: -5, y: -4, boxShadow: '6px 6px 0px 0px rgba(170, 186, 44, 1)' }}
          whileTap={{ x: -2, y: -2, boxShadow: '3px 3px 0px 0px rgba(170, 186, 44, 1)' }}
          transition={{ type: 'spring', stiffness: 320, damping: 22, color: COLOR_TRANSITION }}
        >
          Benefits entdecken
        </motion.button>
      </motion.div>
    </div>
  )
}
