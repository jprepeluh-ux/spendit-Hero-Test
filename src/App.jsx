import { useState } from 'react'
import Navbar from './components/Navbar'
import Herostage from './components/Herostage'

export default function App() {
  const [variant, setVariant] = useState('grau')

  return (
    <div className="app">
      <Navbar variant={variant} setVariant={setVariant} />
      <Herostage variant={variant} />
    </div>
  )
}
