import { Routes, Route } from 'react-router-dom'
import Home from './Pages/home'
import About from './Pages/about'
import NotFound from './Pages/notFound'
import Navbar from './components/Navbar'
import Login from './Pages/login'
import Signup from './Pages/signup'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App;

