import { useState } from 'react'
import Navbar from './components/Navbar'
import Herostage from './components/Herostage'
import HerostageEditorial from './components/HerostageEditorial'

export default function App() {
  const [variant, setVariant] = useState('grau')

  return (
    <div className="app">
      <Navbar variant={variant} setVariant={setVariant} />
      {variant === 'hell' ? <HerostageEditorial /> : <Herostage variant={variant} />}
    </div>
  )
}
