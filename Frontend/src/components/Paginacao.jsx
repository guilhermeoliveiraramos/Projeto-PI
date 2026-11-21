export function Paginacao({ paginaAtual, totalItens, itensPorPagina, aoMudarPagina }) {
  const totalPaginas = Math.ceil(totalItens / itensPorPagina) || 1;

  if (totalItens <= itensPorPagina) return null;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '1.2rem',
      flexWrap: 'wrap',
      gap: '10px'
    }}>
      <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        Página <strong>{paginaAtual}</strong> de <strong>{totalPaginas}</strong> ({totalItens} registros)
      </span>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          type="button"
          disabled={paginaAtual === 1}
          onClick={() => aoMudarPagina(paginaAtual - 1)}
          style={{
            backgroundColor: paginaAtual === 1 ? 'var(--border-subtle)' : 'var(--accent-blue)',
            color: paginaAtual === 1 ? 'var(--text-secondary)' : '#ffffff',
            border: 'none',
            cursor: paginaAtual === 1 ? 'not-allowed' : 'pointer'
          }}
        >
          ← Anterior
        </button>

        <button
          type="button"
          disabled={paginaAtual === totalPaginas}
          onClick={() => aoMudarPagina(paginaAtual + 1)}
          style={{
            backgroundColor: paginaAtual === totalPaginas ? 'var(--border-subtle)' : 'var(--accent-blue)',
            color: paginaAtual === totalPaginas ? 'var(--text-secondary)' : '#ffffff',
            border: 'none',
            cursor: paginaAtual === totalPaginas ? 'not-allowed' : 'pointer'
          }}
        >
          Próxima →
        </button>
      </div>
    </div>
  );
}
