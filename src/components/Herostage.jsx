import { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const SPRING = { stiffness: 80, damping: 20, mass: 1 }
const COLOR_TRANSITION = { duration: 0.4, ease: 'easeInOut' }

const headlineContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.26, delayChildren: 0.1 } },
}

const headlineLine = {
  hidden: { y: '110%', opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } },
}

const THEMES = {
  grau:    { textboxBg: 'rgba(61, 61, 61, 0.8)',  btnText: '#494949', btnBg: '#E8FE42', accent: '#E8FE42', btnShadow: 'rgba(170, 186, 44, 1)' },
  violett: { textboxBg: 'rgba(68, 53, 99, 0.8)',  btnText: '#443563', btnBg: '#E8FE42', accent: '#E8FE42', btnShadow: 'rgba(170, 186, 44, 1)' },
  gruen:   { textboxBg: 'linear-gradient(185deg, rgba(54, 42, 77, 0.9) 20%, rgba(227, 127, 235, 0.88) 100%)', btnText: '#362A4D', btnBg: '#B8FF6F', accent: '#B8FF6F', btnShadow: 'rgba(107, 145, 67, 1)' },
}

export default function Herostage({ variant }) {
  const theme = THEMES[variant] ?? THEMES.grau
  const ref = useRef(null)
  const [btnRevealed, setBtnRevealed] = useState(false)

  useEffect(() => { setBtnRevealed(false) }, [variant])

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

  useEffect(() => {
    if (!('ontouchstart' in window)) return

    let base = null
    let started = false

    function handleOrientation(e) {
      if (base === null) base = { gamma: e.gamma ?? 0, beta: e.beta ?? 0 }
      const dx = ((e.gamma ?? 0) - base.gamma) * 10
      const dy = ((e.beta  ?? 0) - base.beta)  * 6
      rawX.set(Math.max(-300, Math.min(300, dx)))
      rawY.set(Math.max(-300, Math.min(300, dy)))
    }

    function startListening() {
      if (started) return
      started = true
      window.addEventListener('deviceorientation', handleOrientation)
    }

    function requestAccess() {
      document.removeEventListener('touchend', requestAccess)
      document.removeEventListener('click', requestAccess)
      if (typeof DeviceOrientationEvent?.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
          .then(state => { if (state === 'granted') startListening() })
          .catch(() => {})
      } else {
        startListening()
      }
    }

    const timer = setTimeout(() => {
      document.addEventListener('touchend', requestAccess, { once: true })
      document.addEventListener('click',    requestAccess, { once: true })
    }, 300)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('touchend', requestAccess)
      document.removeEventListener('click',    requestAccess)
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [rawX, rawY])

  const headlineLines = [
    <>Benefits, die sich</>,
    <>nach <span style={{ color: theme.accent }}>Lifestyle</span></>,
    <>anfühlen.</>,
  ]

  return (
    <div ref={ref} className="hs" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>

      {/* Layer 1: Hintergrund */}
      <motion.div className="hs-fill" style={{ x: bgX, y: bgY }}>
        <img src="/assets/bg.png" alt="" className="hs-img" />
      </motion.div>

      {/* Layer 2: Plus — CSS-Mask mit cross-fading Hintergrundschichten */}
      <motion.div className="hs-plus" style={{ x: plusX, y: plusY }}>
        {/* Gelb (grau + violett) */}
        <motion.div
          className="hs-plus-mask"
          style={{ background: '#E8FE41' }}
          animate={{ opacity: variant !== 'gruen' ? 1 : 0 }}
          transition={COLOR_TRANSITION}
        />
        {/* Gradient (gruen) */}
        <motion.div
          className="hs-plus-mask"
          style={{ background: 'linear-gradient(180deg, #B8FF6F 35%, #EE20FF 92%)' }}
          animate={{ opacity: variant === 'gruen' ? 1 : 0 }}
          transition={COLOR_TRANSITION}
        />
      </motion.div>

      {/* Layer 3: Freisteller */}
      <motion.div className="hs-fill hs-fill-frei" style={{ x: freiX, y: freiY }}>
        <img src="/assets/freisteller.png" alt="" className="hs-img hs-frei" />
      </motion.div>

      {/* Layer 4: Textbox — Background via cross-fading Layers */}
      <div className="hs-textbox">
        {/* Hintergrundschichten — cross-fade zwischen Themes */}
        {Object.entries(THEMES).map(([key, t]) => (
          <motion.div
            key={key}
            className="hs-textbox-layer"
            style={{ background: t.textboxBg }}
            animate={{ opacity: variant === key ? 1 : 0 }}
            transition={COLOR_TRANSITION}
          />
        ))}

        <div className="hs-copy">
          <motion.h1
            className="hs-headline"
            key={variant}
            variants={headlineContainer}
            initial="hidden"
            animate="visible"
          >
            {headlineLines.map((line, i) => (
              <div key={i} style={{ overflow: 'hidden', display: 'block' }}>
                <motion.div variants={headlineLine}>{line}</motion.div>
              </div>
            ))}
          </motion.h1>
          <div style={{ overflow: 'hidden' }}>
            <motion.p
              className="hs-body"
              key={`body-${variant}`}
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.78 }}
            >
              Keine starren Gutscheine, sondern die Freiheit, selbst zu wählen.
            </motion.p>
          </div>
        </div>

        <div className="hs-btn-clip" style={{ overflow: btnRevealed ? 'visible' : 'hidden' }}>
          <motion.div
            key={`btn-${variant}`}
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.95 }}
            onAnimationComplete={() => setBtnRevealed(true)}
          >
            <motion.button
              className="hs-btn"
              initial={{ color: theme.btnText, backgroundColor: theme.btnBg, boxShadow: '0px 0px 0px 0px rgba(0, 0, 0, 0)' }}
              animate={{ color: theme.btnText, backgroundColor: theme.btnBg }}
              whileHover={{ x: -5, y: -4, boxShadow: `6px 6px 0px 0px ${theme.btnShadow}` }}
              whileTap={{ x: -2, y: -2, boxShadow: `3px 3px 0px 0px ${theme.btnShadow}` }}
              transition={{ type: 'spring', stiffness: 320, damping: 22, color: COLOR_TRANSITION, backgroundColor: COLOR_TRANSITION }}
            >
              Benefits entdecken
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
