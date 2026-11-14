import { useState, useEffect } from 'react';
import api from '../services/api';
import { alertaSucesso, alertaErro, confirmarExclusao } from '../utils/alertas';

export function Ciclos() {
  const [ciclos, setCiclos] = useState([]);
  const [pneus, setPneus] = useState([]);
  const [arquivos, setArquivos] = useState([]);

  const [dataHora, setDataHora] = useState('');
  const [turno, setTurno] = useState('Manhã');
  const [statusCiclo, setStatusCiclo] = useState('Concluído');
  const [tempoCicloMin, setTempoCicloMin] = useState('');
  const [curaPct, setCuraPct] = useState('');
  const [eficienciaPct, setEficienciaPct] = useState('');
  const [idPneu, setIdPneu] = useState('');
  const [idArquivo, setIdArquivo] = useState('');

  async function carregarDados() {
    try {
      const [resCiclos, resPneus, resArquivos] = await Promise.all([
        api.get('/ciclos'),
        api.get('/pneus'),
        api.get('/arquivos'),
      ]);
      setCiclos(resCiclos.data);
      setPneus(resPneus.data);
      setArquivos(resArquivos.data);
    } catch (erro) {
      console.error('Erro ao carregar dados de ciclos:', erro);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  async function handleCadastrar(e) {
    e.preventDefault();
    try {
      const payload = {
        dataHora,
        turno,
        statusCiclo,
        tempoCicloMin: Number(tempoCicloMin),
        curaPct: Number(curaPct),
        eficienciaPct: Number(eficienciaPct),
        pneu: { idPneu: Number(idPneu) },
        arquivo: idArquivo ? { idArquivo: Number(idArquivo) } : null,
      };

      await api.post('/ciclos', payload);
      carregarDados();
      alertaSucesso('Ciclo registrado!');
    } catch (erro) {
      alertaErro('Erro ao cadastrar ciclo. Confira os campos.');
    }
  }

  async function handleExcluir(id) {
    if (await confirmarExclusao()) {
      try {
        await api.delete(`/ciclos/${id}`);
        carregarDados();
        alertaSucesso('Ciclo excluído!');
      } catch (erro) {
        alertaErro('Erro ao excluir ciclo (verifique se há medições ligadas a ele).');
      }
    }
  }

  return (
    <div>
      <h2>Gerenciamento de Ciclos</h2>

      <form onSubmit={handleCadastrar} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', margin: '20px 0' }}>
        <input type="datetime-local" value={dataHora} onChange={(e) => setDataHora(e.target.value)} required style={{ padding: '8px' }} />

        <select value={turno} onChange={(e) => setTurno(e.target.value)} style={{ padding: '8px' }}>
          <option value="Manhã">Turno: Manhã</option>
          <option value="Tarde">Turno: Tarde</option>
          <option value="Noite">Turno: Noite</option>
        </select>

        <input type="text" placeholder="Status (ex: Concluído)" value={statusCiclo} onChange={(e) => setStatusCiclo(e.target.value)} required style={{ padding: '8px' }} />
        <input type="number" step="0.01" placeholder="Tempo (min)" value={tempoCicloMin} onChange={(e) => setTempoCicloMin(e.target.value)} style={{ padding: '8px' }} />
        <input type="number" step="0.01" placeholder="Cura (%)" value={curaPct} onChange={(e) => setCuraPct(e.target.value)} style={{ padding: '8px' }} />
        <input type="number" step="0.01" placeholder="Eficiência (%)" value={eficienciaPct} onChange={(e) => setEficienciaPct(e.target.value)} style={{ padding: '8px' }} />

        <select value={idPneu} onChange={(e) => setIdPneu(e.target.value)} required style={{ padding: '8px' }}>
          <option value="">Selecione o Pneu...</option>
          {pneus.map((p) => (
            <option key={p.idPneu} value={p.idPneu}>{p.modeloPneu}</option>
          ))}
        </select>

        <select value={idArquivo} onChange={(e) => setIdArquivo(e.target.value)} style={{ padding: '8px' }}>
          <option value="">Arquivo (Opcional)...</option>
          {arquivos.map((a) => (
            <option key={a.idArquivo} value={a.idArquivo}>{a.nomeArquivo}</option>
          ))}
        </select>

        <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#0284c7', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
          Registrar Ciclo
        </button>
      </form>

      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
        <thead>
          <tr style={{ backgroundColor: '#e2e8f0' }}>
            <th>ID</th>
            <th>Pneu</th>
            <th>Data/Hora</th>
            <th>Turno</th>
            <th>Status</th>
            <th>Tempo (min)</th>
            <th>Cura %</th>
            <th>Eficiência %</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {ciclos.map((c) => (
            <tr key={c.idCiclo}>
              <td>{c.idCiclo}</td>
              <td>{c.pneu?.modeloPneu || c.idPneu}</td>
              <td>{c.dataHora}</td>
              <td>{c.turno}</td>
              <td>{c.statusCiclo}</td>
              <td>{c.tempoCicloMin}</td>
              <td>{c.curaPct}%</td>
              <td>{c.eficienciaPct}%</td>
              <td>
                <button onClick={() => handleExcluir(c.idCiclo)} style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
