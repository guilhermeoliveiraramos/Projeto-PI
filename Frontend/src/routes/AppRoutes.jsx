import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Home } from '../pages/Home';
import { Usuarios } from '../pages/Usuarios';
import { Login } from '../pages/Login';
import { Pneus } from '../pages/Pneus';
import { Ciclos } from '../pages/Ciclos';
import { Medicoes } from '../pages/Medicoes';
import { Arquivos } from '../pages/Arquivos';

// Componente que verifica se existe um usuário salvo no navegador
function RotaPrivada({ children }) {
  const usuarioLogado = localStorage.getItem('usuarioLogado');
  return usuarioLogado ? children : <Navigate to="/" />;
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota inicial do site agora abre direto no Login */}
        <Route path="/" element={<Login />} />

        {/* Rotas internas protegidas (exigem login) */}
        <Route element={<RotaPrivada><MainLayout /></RotaPrivada>}>
          <Route path="/inicio" element={<Home />} />
          <Route path="/pneus" element={<Pneus />} />
          <Route path="/ciclos" element={<Ciclos />} />
          <Route path="/medicoes" element={<Medicoes />} />
          <Route path="/arquivos" element={<Arquivos />} />
          <Route path="/usuarios" element={<Usuarios />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
