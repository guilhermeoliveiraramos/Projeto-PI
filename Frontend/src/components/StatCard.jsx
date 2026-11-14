import { Link } from 'react-router-dom';

export function StatCard({ titulo, valor, subtexto, cor, destino }) {
  return (
    <Link
      to={destino}
      style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        borderLeft: `5px solid ${cor}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        textDecoration: 'none',
        color: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
      }}
    >
      <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>
        {titulo}
      </span>
      <strong style={{ fontSize: '2rem', color: '#0f172a' }}>
        {valor}
      </strong>
      <span style={{ fontSize: '0.85rem', color: '#475569' }}>
        {subtexto}
      </span>
    </Link>
  );
}
