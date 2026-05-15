import { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const SPRING = { stiffness: 80, damping: 20, mass: 1 }

const headlineContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.26, delayChildren: 0.1 } },
}

const headlineLine = {
  hidden: { y: '110%', opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } },
}

const HEADLINE_LINES = [
  <>Benefits, die sich</>,
  <>nach <span style={{ color: '#e37feb' }}>Lifestyle</span></>,
  <>anfühlen.</>,
]

export default function HerostageEditorial() {
  const ref = useRef(null)
  const [btnRevealed, setBtnRevealed] = useState(false)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, SPRING)
  const y = useSpring(rawY, SPRING)

  const compX = useTransform(x, v => v * 0.025)
  const compY = useTransform(y, v => v * 0.025)

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
    let base = null, started = false

    function handleOrientation(e) {
      if (base === null) base = { gamma: e.gamma ?? 0, beta: e.beta ?? 0 }
      const dx = ((e.gamma ?? 0) - base.gamma) * 10
      const dy = ((e.beta  ?? 0) - base.beta)  * 6
      rawX.set(Math.max(-300, Math.min(300, dx)))
      rawY.set(Math.max(-300, Math.min(300, dy)))
    }

    function startListening() {
      if (started) return; started = true
      window.addEventListener('deviceorientation', handleOrientation)
    }

    function requestAccess() {
      document.removeEventListener('touchend', requestAccess)
      document.removeEventListener('click', requestAccess)
      if (typeof DeviceOrientationEvent?.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission().then(s => { if (s === 'granted') startListening() }).catch(() => {})
      } else startListening()
    }

    const timer = setTimeout(() => {
      document.addEventListener('touchend', requestAccess, { once: true })
      document.addEventListener('click', requestAccess, { once: true })
    }, 300)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('touchend', requestAccess)
      document.removeEventListener('click', requestAccess)
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [rawX, rawY])

  return (
    <div ref={ref} className="hs-ed" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>

      {/* Left content */}
      <div className="hs-ed-content">
        <motion.h1
          className="hs-ed-headline"
          variants={headlineContainer}
          initial="hidden"
          animate="visible"
        >
          {HEADLINE_LINES.map((line, i) => (
            <div key={i} style={{ overflow: 'hidden', display: 'block' }}>
              <motion.div variants={headlineLine}>{line}</motion.div>
            </div>
          ))}
        </motion.h1>

        <div style={{ overflow: 'hidden' }}>
          <motion.p
            className="hs-ed-body"
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.78 }}
          >
            Keine starren Gutscheine, sondern die Freiheit, selbst zu wählen.
          </motion.p>
        </div>

        <div className="hs-btn-clip" style={{ overflow: btnRevealed ? 'visible' : 'hidden' }}>
          <motion.div
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.95 }}
            onAnimationComplete={() => setBtnRevealed(true)}
          >
            <motion.button
              className="hs-btn"
              style={{ backgroundColor: '#B8FF6F', color: '#362A4D' }}
              whileHover={{ x: -5, y: -4, boxShadow: '6px 6px 0px 0px rgba(107, 145, 67, 1)' }}
              whileTap={{ x: -2, y: -2, boxShadow: '3px 3px 0px 0px rgba(107, 145, 67, 1)' }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              Benefits entdecken
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Right: Freisteller mit Parallax */}
      <div className="hs-ed-freisteller-wrap">
        <motion.div className="hs-ed-freisteller" style={{ x: compX, y: compY }}>
          <img
            src="/assets/editorial/freisteller-editorial.png"
            alt=""
          />
        </motion.div>
      </div>

    </div>
  )
}
