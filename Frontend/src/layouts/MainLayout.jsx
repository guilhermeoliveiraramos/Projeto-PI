import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

export function MainLayout() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [tema, setTema] = useState(() => localStorage.getItem('tema') || 'dark');
  const navigate = useNavigate();
  const location = useLocation();

  const usuario = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema);
    localStorage.setItem('tema', tema);
  }, [tema]);

  function alternarTema() {
    setTema((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }

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
          <div className="navbar-brand">
            <span className="laser-dot"></span>
            <Link to="/inicio">PROJETO // PI</Link>
          </div>

          <button
            type="button"
            className="navbar-toggle"
            onClick={() => setMenuAberto(!menuAberto)}
            aria-label="Abrir menu"
          >
            {menuAberto ? '✕' : '☰'}
          </button>

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

            <div className="navbar-user">
              <div className="user-badge" style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <span>
                  Olá, <strong>{usuario.nomeUsuario || 'Usuário'}</strong>
                </span>

                {usuario.cargo && (
                  <span
                    style={{
                      backgroundColor: 'var(--accent-soft)',
                      color: 'var(--accent-blue)',
                      border: '1px solid var(--accent-blue)',
                      padding: '2px 10px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                    }}
                  >
                    {usuario.cargo}
                  </span>
                )}
              </div>

              {/* BOTÃO DE TEMA NA BARRA SUPERIOR */}
              <button
                type="button"
                onClick={alternarTema}
                style={{
                  backgroundColor: 'var(--accent-soft)',
                  color: 'var(--accent-blue)',
                  border: '1px solid var(--border-subtle)',
                  padding: '6px 14px',
                  fontSize: '0.85rem',
                }}
              >
                {tema === 'dark' ? '☀️ Claro' : '🌙 Noturno'}
              </button>

              <button type="button" onClick={handleSair} className="btn-logout">
                Sair
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main
        key={location.pathname}
        className="page-transition"
        style={{ padding: '1.5rem', maxWidth: '1250px', margin: '0 auto' }}
      >
        <Outlet />
      </main>
    </div>
  );
}
