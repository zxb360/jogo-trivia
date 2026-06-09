import { Route, Routes } from 'react-router-dom'
// import Login from './pages/Login'
import Home from './pages/Home'
import Jogo from './pages/Jogo'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/jogo" element={<Jogo />} />
      </Routes>
    </>
  )
}

export default App
