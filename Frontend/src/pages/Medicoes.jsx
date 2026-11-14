import { useState, useEffect } from 'react';
import api from '../services/api';
import { alertaSucesso, alertaErro, confirmarExclusao } from '../utils/alertas';

export function Medicoes() {
  const [medicoes, setMedicoes] = useState([]);
  const [ciclos, setCiclos] = useState([]);

  const [temperaturaC, setTemperaturaC] = useState('');
  const [pressaoBar, setPressaoBar] = useState('');
  const [vibracaoMmS, setVibracaoMmS] = useState('');
  const [consumoKwh, setConsumoKwh] = useState('');
  const [tempoValvula, setTempoValvula] = useState('');
  const [idCiclo, setIdCiclo] = useState('');

  async function carregarDados() {
    try {
      const [resMedicoes, resCiclos] = await Promise.all([
        api.get('/medicoes'),
        api.get('/ciclos'),
      ]);
      setMedicoes(resMedicoes.data);
      setCiclos(resCiclos.data);
    } catch (erro) {
      console.error('Erro ao carregar medições:', erro);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  async function handleCadastrar(e) {
    e.preventDefault();
    try {
      await api.post('/medicoes', {
        temperaturaC: Number(temperaturaC),
        pressaoBar: Number(pressaoBar),
        vibracaoMmS: Number(vibracaoMmS),
        consumoKwh: Number(consumoKwh),
        tempoValvula: Number(tempoValvula),
        ciclo: { idCiclo: Number(idCiclo) },
      });

      setTemperaturaC('');
      setPressaoBar('');
      setVibracaoMmS('');
      setConsumoKwh('');
      setTempoValvula('');
      carregarDados();
      alertaSucesso('Medição registrada!');
    } catch (erro) {
      alertaErro('Erro ao cadastrar medição.');
    }
  }

  async function handleExcluir(id) {
    if (await confirmarExclusao()) {
      try {
        await api.delete(`/medicoes/${id}`);
        carregarDados();
        alertaSucesso('Medição excluída!');
      } catch (erro) {
        alertaErro('Erro ao excluir medição.');
      }
    }
  }

  return (
    <div>
      <h2>Medições dos Ciclos</h2>

      <form onSubmit={handleCadastrar} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', margin: '20px 0' }}>
        <select value={idCiclo} onChange={(e) => setIdCiclo(e.target.value)} required style={{ padding: '8px' }}>
          <option value="">Selecione o Ciclo...</option>
          {ciclos.map((c) => (
            <option key={c.idCiclo} value={c.idCiclo}>
              Ciclo #{c.idCiclo} - {c.pneu?.modeloPneu || c.turno}
            </option>
          ))}
        </select>

        <input type="number" step="0.01" placeholder="Temperatura (°C)" value={temperaturaC} onChange={(e) => setTemperaturaC(e.target.value)} required style={{ padding: '8px' }} />
        <input type="number" step="0.01" placeholder="Pressão (bar)" value={pressaoBar} onChange={(e) => setPressaoBar(e.target.value)} required style={{ padding: '8px' }} />
        <input type="number" step="0.01" placeholder="Vibração (mm/s)" value={vibracaoMmS} onChange={(e) => setVibracaoMmS(e.target.value)} required style={{ padding: '8px' }} />
        <input type="number" step="0.01" placeholder="Consumo (kWh)" value={consumoKwh} onChange={(e) => setConsumoKwh(e.target.value)} required style={{ padding: '8px' }} />
        <input type="number" step="0.01" placeholder="Tempo Válvula" value={tempoValvula} onChange={(e) => setTempoValvula(e.target.value)} required style={{ padding: '8px' }} />

        <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#0284c7', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
          Registrar Medição
        </button>
      </form>

      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
        <thead>
          <tr style={{ backgroundColor: '#e2e8f0' }}>
            <th>ID</th>
            <th>Ciclo</th>
            <th>Temp. (°C)</th>
            <th>Pressão (bar)</th>
            <th>Vibração (mm/s)</th>
            <th>Consumo (kWh)</th>
            <th>Tempo Válvula</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {medicoes.map((m) => (
            <tr key={m.idMedicao}>
              <td>{m.idMedicao}</td>
              <td>#{m.ciclo?.idCiclo || m.idCiclo}</td>
              <td>{m.temperaturaC}</td>
              <td>{m.pressaoBar}</td>
              <td>{m.vibracaoMmS}</td>
              <td>{m.consumoKwh}</td>
              <td>{m.tempoValvula}</td>
              <td>
                <button onClick={() => handleExcluir(m.idMedicao)} style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}>
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
