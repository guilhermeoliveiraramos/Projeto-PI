import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { StatCard } from '../components/StatCard';

export function Home() {
  const [dadosBrutos, setDadosBrutos] = useState({
    pneus: [],
    ciclos: [],
    medicoes: [],
    arquivos: [],
    usuarios: [],
  });

  const [filtroArquivo, setFiltroArquivo] = useState('TODOS');
  const [filtroTurno, setFiltroTurno] = useState('TODOS');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarTudo() {
      try {
        const [resPneus, resCiclos, resMedicoes, resArquivos, resUsuarios] = await Promise.all([
          api.get('/pneus'),
          api.get('/ciclos'),
          api.get('/medicoes'),
          api.get('/arquivos'),
          api.get('/usuarios'),
        ]);

        setDadosBrutos({
          pneus: resPneus.data,
          ciclos: resCiclos.data,
          medicoes: resMedicoes.data,
          arquivos: resArquivos.data,
          usuarios: resUsuarios.data,
        });
      } catch (erro) {
        console.error('Erro ao carregar dados do dashboard:', erro);
      } finally {
        setCarregando(false);
      }
    }

    carregarTudo();
  }, []);

  if (carregando) {
    return <p style={{ fontSize: '1.1rem', color: '#475569' }}>Carregando indicadores...</p>;
  }

  const ciclosFiltrados = dadosBrutos.ciclos.filter((c) => {
    const passaArquivo = filtroArquivo === 'TODOS' || String(c.arquivo?.idArquivo) === filtroArquivo;
    const passaTurno = filtroTurno === 'TODOS' || c.turno === filtroTurno;
    return passaArquivo && passaTurno;
  });

  const idsCiclosFiltrados = new Set(ciclosFiltrados.map((c) => c.idCiclo));
  const medicoesFiltradas = dadosBrutos.medicoes.filter((m) =>
    idsCiclosFiltrados.has(m.ciclo?.idCiclo)
  );

  const totalEstoquePneus = dadosBrutos.pneus.reduce((acc, p) => acc + (p.quantidade || 0), 0);

  const mediaEficiencia = ciclosFiltrados.length > 0
    ? (ciclosFiltrados.reduce((acc, c) => acc + (c.eficienciaPct || 0), 0) / ciclosFiltrados.length).toFixed(1)
    : 0;

  const mediaTemperatura = medicoesFiltradas.length > 0
    ? (medicoesFiltradas.reduce((acc, m) => acc + (m.temperaturaC || 0), 0) / medicoesFiltradas.length).toFixed(1)
    : 0;

  const totalConsumoKwh = medicoesFiltradas
    .reduce((acc, m) => acc + (m.consumoKwh || 0), 0)
    .toFixed(1);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ color: '#0f172a' }}>Dashboard de Produção</h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Filtre por lote de arquivo CSV ou turno para analisar os indicadores.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select
            value={filtroArquivo}
            onChange={(e) => setFiltroArquivo(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: 'white' }}
          >
            <option value="TODOS">Todos os Arquivos (CSV)</option>
            {dadosBrutos.arquivos.map((arq) => (
              <option key={arq.idArquivo} value={String(arq.idArquivo)}>
                Arquivo: {arq.nomeArquivo}
              </option>
            ))}
          </select>

          <select
            value={filtroTurno}
            onChange={(e) => setFiltroTurno(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: 'white' }}
          >
            <option value="TODOS">Todos os Turnos</option>
            <option value="Manhã">Turno: Manhã</option>
            <option value="Tarde">Turno: Tarde</option>
            <option value="Noite">Turno: Noite</option>
          </select>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.2rem',
        marginBottom: '2rem'
      }}>
        <StatCard titulo="Ciclos Analisados" valor={ciclosFiltrados.length} subtexto={`Eficiência média: ${mediaEficiencia}%`} cor="#16a34a" destino="/ciclos" />
        <StatCard titulo="Temperatura Média" valor={`${mediaTemperatura} °C`} subtexto={`${medicoesFiltradas.length} medições analisadas`} cor="#dc2626" destino="/medicoes" />
        <StatCard titulo="Consumo Energético" valor={`${totalConsumoKwh} kWh`} subtexto="Soma do lote selecionado" cor="#d97706" destino="/medicoes" />
        <StatCard titulo="Pneus em Estoque" valor={totalEstoquePneus} subtexto={`${dadosBrutos.pneus.length} modelos cadastrados`} cor="#0284c7" destino="/pneus" />
        <StatCard titulo="Arquivos Importados" valor={dadosBrutos.arquivos.length} subtexto={`${dadosBrutos.usuarios.length} usuários ativos`} cor="#7c3aed" destino="/arquivos" />
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        marginBottom: '2rem',
        border: '1px dashed #cbd5e1',
        textAlign: 'center',
        color: '#64748b'
      }}>
        <strong>Espaço Reservado para Gráficos (Recharts)</strong>
        <p style={{ fontSize: '0.9rem', marginTop: '5px' }}>
          Quando o CSV real for importado, podemos plugar aqui gráficos usando <code>ciclosFiltrados</code>.
        </p>
      </div>

      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ color: '#0f172a' }}>Registros Recentes (Filtro Atual)</h3>
          <Link to="/ciclos" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>
            Gerenciar todos →
          </Link>
        </div>

        {ciclosFiltrados.length === 0 ? (
          <p style={{ color: '#64748b' }}>Nenhum ciclo encontrado para o filtro selecionado.</p>
        ) : (
          <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'left' }}>
                <th>ID</th>
                <th>Pneu</th>
                <th>Arquivo CSV</th>
                <th>Turno</th>
                <th>Status</th>
                <th>Eficiência</th>
              </tr>
            </thead>
            <tbody>
              {ciclosFiltrados.slice(-5).reverse().map((ciclo) => (
                <tr key={ciclo.idCiclo}>
                  <td>#{ciclo.idCiclo}</td>
                  <td>{ciclo.pneu?.modeloPneu || '-'}</td>
                  <td>{ciclo.arquivo?.nomeArquivo || 'Manual'}</td>
                  <td>{ciclo.turno}</td>
                  <td>{ciclo.statusCiclo}</td>
                  <td><strong>{ciclo.eficienciaPct}%</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
