import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Inscription from './pages/Inscription.jsx';
import Contact from './pages/Contact.jsx';
import Admin from './pages/Admin.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        <Route path="/gestion-chmc-2026" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
