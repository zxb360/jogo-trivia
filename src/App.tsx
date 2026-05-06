import { Route } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Home from './pages/Home'

function App() {
  return (
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
    </>
  )
}

export default App
