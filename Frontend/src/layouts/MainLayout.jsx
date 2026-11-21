import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

export function MainLayout() {
  const [menuAberto, setMenuAberto] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Lê os dados do usuário salvos no login (nomeUsuario, cargo, email, idUsuario)
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');

  function handleSair() {
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
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <header className="futuristic-navbar">
        <div className="navbar-container">
          {/* LOGO / TÍTULO */}
          <div className="navbar-brand">
            <span className="laser-dot"></span>
            <Link to="/inicio">PROJETO // PI</Link>
          </div>

          {/* BOTÃO HAMBÚRGUER PARA CELULAR */}
          <button
            type="button"
            className="navbar-toggle"
            onClick={() => setMenuAberto(!menuAberto)}
            aria-label="Abrir menu"
          >
            {menuAberto ? '✕' : '☰'}
          </button>

          {/* LINKS DE NAVEGAÇÃO */}
          <nav className={`navbar-links ${menuAberto ? 'ativo' : ''}`}>
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

            {/* USUÁRIO LOGADO + BADGE DE CARGO + BOTÃO SAIR */}
            <div className="navbar-user">
              <div className="user-badge" style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <span>
                  Olá, <strong>{usuario.nomeUsuario || 'Usuário'}</strong>
                </span>

                {usuario.cargo && (
                  <span
                    style={{
                      backgroundColor: 'rgba(0, 229, 255, 0.12)',
                      color: 'var(--laser-blue)',
                      border: '1px solid var(--laser-blue)',
                      padding: '2px 10px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      boxShadow: '0 0 8px rgba(0, 229, 255, 0.3)',
                    }}
                  >
                    {usuario.cargo}
                  </span>
                )}
              </div>

              <button type="button" onClick={handleSair} className="btn-logout">
                Sair
              </button>
            </div>
          </nav>
        </div>

        {/* FEIXE DE LASER INFERIOR */}
        <div className="navbar-laser-border"></div>
      </header>

      <main style={{ padding: '1.5rem', maxWidth: '1250px', margin: '0 auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
