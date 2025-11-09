import React from 'react'
import Dashboard from './Components/Dashboard'
import { BrowserRouter,Routes,Route } from 'react-router-dom'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Dashboard />} />
      </Routes>
      </BrowserRouter>
  )
}

export default App