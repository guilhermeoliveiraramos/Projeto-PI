import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
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
    return <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Carregando indicadores...</p>;
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
      {/* CABEÇALHO E FILTROS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ color: 'var(--text-primary)' }}>Dashboard de Produção</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
            Filtre por lote de arquivo CSV ou turno para analisar os indicadores.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select value={filtroArquivo} onChange={(e) => setFiltroArquivo(e.target.value)}>
            <option value="TODOS">Todos os Arquivos (CSV)</option>
            {dadosBrutos.arquivos.map((arq) => (
              <option key={arq.idArquivo} value={String(arq.idArquivo)}>
                Arquivo: {arq.nomeArquivo}
              </option>
            ))}
          </select>

          <select value={filtroTurno} onChange={(e) => setFiltroTurno(e.target.value)}>
            <option value="TODOS">Todos os Turnos</option>
            <option value="Manhã">Turno: Manhã</option>
            <option value="Tarde">Turno: Tarde</option>
            <option value="Noite">Turno: Noite</option>
          </select>
        </div>
      </div>

      {/* CARTÕES DE INDICADORES */}
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

      {/* GRÁFICOS INTERATIVOS (RECHARTS) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Gráfico 1: Eficiência e Cura por Ciclo */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          padding: '1.5rem',
          borderRadius: '18px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-card)'
        }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Eficiência (%) por Ciclo</h3>
          {ciclosFiltrados.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sem ciclos para exibir no gráfico.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={ciclosFiltrados}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis dataKey="idCiclo" stroke="var(--text-secondary)" tickFormatter={(id) => `#${id}`} />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-subtle)',
                    borderRadius: '10px',
                    color: 'var(--text-primary)'
                  }}
                />
                <Legend />
                <Bar dataKey="eficienciaPct" name="Eficiência (%)" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                <Bar dataKey="curaPct" name="Cura (%)" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Gráfico 2: Temperatura e Consumo Energético */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          padding: '1.5rem',
          borderRadius: '18px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-card)'
        }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Temperatura (°C) vs Consumo (kWh)</h3>
          {medicoesFiltradas.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sem medições para exibir no gráfico.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={medicoesFiltradas}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis dataKey="idMedicao" stroke="var(--text-secondary)" tickFormatter={(id) => `#${id}`} />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-subtle)',
                    borderRadius: '10px',
                    color: 'var(--text-primary)'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="temperaturaC" name="Temp. (°C)" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="consumoKwh" name="Consumo (kWh)" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* TABELA DE REGISTROS RECENTES */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        padding: '1.5rem',
        borderRadius: '18px',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
          <h3 style={{ color: 'var(--text-primary)' }}>Registros Recentes (Filtro Atual)</h3>
          <Link to="/ciclos" style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}>
            Gerenciar todos →
          </Link>
        </div>

        {ciclosFiltrados.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>Nenhum ciclo encontrado para o filtro selecionado.</p>
        ) : (
          <table>
            <thead>
              <tr style={{ textAlign: 'left' }}>
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
