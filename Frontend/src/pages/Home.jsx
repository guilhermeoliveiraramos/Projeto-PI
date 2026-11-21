import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import api from '../services/api';
import { StatCard } from '../components/StatCard';

export function Home() {
  const [resumo, setResumo] = useState(null);
  const [filtroArquivo, setFiltroArquivo] = useState('TODOS');
  const [filtroTurno, setFiltroTurno] = useState('TODOS');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarResumo() {
      setCarregando(true);
      try {
        const resposta = await api.get('/dashboard/resumo', {
          params: { arquivoId: filtroArquivo, turno: filtroTurno }
        });
        setResumo(resposta.data);
      } catch (erro) {
        console.error('Erro ao carregar resumo:', erro);
      } finally {
        setCarregando(false);
      }
    }
    carregarResumo();
  }, [filtroArquivo, filtroTurno]);

  if (carregando && !resumo) {
    return <p style={{ color: 'var(--text-secondary)' }}>Carregando indicadores...</p>;
  }

  const graficosCiclos = resumo?.graficosCiclos || [];
  const graficosMedicoes = resumo?.graficosMedicoes || [];
  const arquivos = resumo?.arquivos || [];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h2>Dashboard de Produção</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Filtre por arquivo CSV ou turno.</p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select value={filtroArquivo} onChange={(e) => setFiltroArquivo(e.target.value)}>
            <option value="TODOS">Todos os Arquivos (CSV)</option>
            {arquivos.map((arq) => (
              <option key={arq.idArquivo} value={String(arq.idArquivo)}>Arquivo: {arq.nomeArquivo}</option>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.2rem', marginBottom: '2rem' }}>
        <StatCard titulo="Ciclos Analisados" valor={resumo?.totalCiclos || 0} subtexto={`Eficiência: ${resumo?.mediaEficiencia || 0}%`} cor="#16a34a" destino="/ciclos" />
        <StatCard titulo="Temperatura Média" valor={`${resumo?.mediaTemperatura || 0} °C`} subtexto={`${resumo?.totalMedicoes || 0} medições`} cor="#dc2626" destino="/medicoes" />
        <StatCard titulo="Consumo Energético" valor={`${resumo?.totalConsumoKwh || 0} kWh`} subtexto="Soma do lote" cor="#d97706" destino="/medicoes" />
        <StatCard titulo="Pneus em Estoque" valor={resumo?.totalEstoquePneus || 0} subtexto={`${resumo?.totalModelosPneus || 0} modelos`} cor="#0284c7" destino="/pneus" />
        <StatCard titulo="Arquivos Importados" valor={resumo?.totalArquivos || 0} subtexto={`${resumo?.totalUsuarios || 0} usuários`} cor="#7c3aed" destino="/arquivos" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: '18px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Eficiência (%) - Últimos 50 Ciclos</h3>
          <ResponsiveContainer width="100%" height={270}>
            <BarChart data={graficosCiclos}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="idCiclo" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip />
              <Legend />
              <Bar dataKey="eficienciaPct" name="Eficiência (%)" fill="#38bdf8" isAnimationActive={false} />
              <Bar dataKey="curaPct" name="Cura (%)" fill="#10b981" isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: '18px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Temperatura (°C) vs Consumo (kWh)</h3>
          <ResponsiveContainer width="100%" height={270}>
            <LineChart data={graficosMedicoes}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="idMedicao" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="temperaturaC" name="Temp. (°C)" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="consumoKwh" name="Consumo (kWh)" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: '18px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Registros Recentes</h3>
          <Link to="/ciclos" style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: '600' }}>Gerenciar todos →</Link>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th><th>Pneu</th><th>Arquivo</th><th>Turno</th><th>Status</th><th>Eficiência</th>
            </tr>
          </thead>
          <tbody>
            {graficosCiclos.slice(-5).reverse().map((ciclo) => (
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
      </div>
    </div>
  );
}
