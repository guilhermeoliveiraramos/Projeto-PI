import { Link } from 'react-router-dom';

export function StatCard({ titulo, valor, subtexto, cor, destino }) {
  return (
    <Link
      to={destino}
      className="stat-card"
      style={{
        backgroundColor: 'var(--bg-card)',
        padding: '1.5rem',
        borderRadius: '18px',
        border: '1px solid var(--border-subtle)',
        borderLeft: `5px solid ${cor}`,
        boxShadow: 'var(--shadow-card)',
        textDecoration: 'none',
        color: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
      }}
    >
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 'bold', textTransform: 'uppercase' }}>
        {titulo}
      </span>
      <strong style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>
        {valor}
      </strong>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        {subtexto}
      </span>
    </Link>
  );
}
