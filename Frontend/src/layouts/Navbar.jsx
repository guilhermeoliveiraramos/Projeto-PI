import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  function handleLogout() {
    localStorage.removeItem('usuarioLogado');
    navigate('/');
  }

  const links = [
    { path: '/inicio', label: 'Início' },
    { path: '/pneus', label: 'Pneus' },
    { path: '/ciclos', label: 'Ciclos' },
    { path: '/medicoes', label: 'Medições' },
    { path: '/arquivos', label: 'Arquivos' },
    { path: '/usuarios', label: 'Usuários' },
  ];

  return (
    <nav className="futuristic-navbar">
      <div className="navbar-container">
        {/* LOGO / TÍTULO */}
        <div className="navbar-brand">
          <span className="laser-dot"></span>
          <Link to="/inicio">PROJETO // PI</Link>
        </div>

        {/* BOTÃO HAMBÚRGUER PARA CELULAR */}
        <button
          className="navbar-toggle"
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label="Abrir menu"
        >
          {menuAberto ? '✕' : '☰'}
        </button>

        {/* LINKS DE NAVEGAÇÃO */}
        <div className={`navbar-links ${menuAberto ? 'ativo' : ''}`}>
          {links.map((item) => {
            const ativo = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuAberto(false)}
                className={`nav-item ${ativo ? 'nav-item-ativo' : ''}`}
              >
                {item.label}
              </Link>
            );
          })}

          {/* INFORMAÇÕES DO USUÁRIO E LOGOUT */}
          <div className="navbar-user">
            {usuarioLogado && (
              <span className="user-badge">
                {usuarioLogado.nomeUsuario} • <strong>{usuarioLogado.cargo}</strong>
              </span>
            )}
            <button onClick={handleLogout} className="btn-logout">
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* FEIXE DE LASER INFERIOR */}
      <div className="navbar-laser-border"></div>
    </nav>
  );
}
