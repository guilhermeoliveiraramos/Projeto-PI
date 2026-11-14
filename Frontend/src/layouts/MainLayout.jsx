import { Outlet, Link, useNavigate } from 'react-router-dom';

export function MainLayout() {
  const navigate = useNavigate();

  // Lê os dados do usuário salvos no login (nomeUsuario, cargo, email, idUsuario)
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');

  function handleSair() {
    localStorage.removeItem('usuarioLogado');
    navigate('/');
  }

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <header style={{ backgroundColor: '#0f172a', padding: '1rem 2rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <strong style={{ fontSize: '1.2rem', marginRight: '1rem', color: '#38bdf8' }}>
            Projeto PI
          </strong>

          <Link to="/inicio" style={{ color: 'white', textDecoration: 'none' }}>Início</Link>
          <Link to="/pneus" style={{ color: 'white', textDecoration: 'none' }}>Pneus</Link>
          <Link to="/ciclos" style={{ color: 'white', textDecoration: 'none' }}>Ciclos</Link>
          <Link to="/medicoes" style={{ color: 'white', textDecoration: 'none' }}>Medições</Link>
          <Link to="/arquivos" style={{ color: 'white', textDecoration: 'none' }}>Arquivos</Link>
          <Link to="/usuarios" style={{ color: 'white', textDecoration: 'none' }}>Usuários</Link>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#cbd5e1' }}>
            <span>
              Olá, <strong>{usuario.nomeUsuario || 'Usuário'}</strong>
            </span>

            {/* Etiqueta (Badge) com o Cargo do Usuário */}
            {usuario.cargo && (
              <span style={{
                backgroundColor: '#1e293b',
                color: '#38bdf8',
                border: '1px solid #38bdf8',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}>
                {usuario.cargo}
              </span>
            )}
          </div>

          <button
            onClick={handleSair}
            style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Sair
          </button>
        </div>
      </header>

      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
