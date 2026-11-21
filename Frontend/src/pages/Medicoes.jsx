import { useState, useEffect } from 'react';
import api from '../services/api';
import { alertaSucesso, alertaErro, confirmarExclusao } from '../utils/alertas';
import { Paginacao } from '../components/Paginacao';

export function Medicoes() {
  const [medicoes, setMedicoes] = useState([]);
  const [ciclos, setCiclos] = useState([]);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 50;

  const [temperaturaC, setTemperaturaC] = useState('');
  const [pressaoBar, setPressaoBar] = useState('');
  const [vibracaoMmS, setVibracaoMmS] = useState('');
  const [consumoKwh, setConsumoKwh] = useState('');
  const [tempoValvula, setTempoValvula] = useState('');
  const [idCiclo, setIdCiclo] = useState('');

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const isGerente = usuarioLogado?.cargo?.toUpperCase() === 'GERENTE';
  const headersAuth = { 'X-User-Id': usuarioLogado?.idUsuario };

  async function carregarDados() {
    try {
      const [resMedicoes, resCiclos] = await Promise.all([
        api.get('/medicoes'),
        api.get('/ciclos'),
      ]);
      const lista = Array.isArray(resMedicoes.data) ? [...resMedicoes.data].reverse() : [];
      setMedicoes(lista);
      setCiclos(Array.isArray(resCiclos.data) ? resCiclos.data : []);
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
      await api.post(
        '/medicoes',
        {
          temperaturaC: Number(temperaturaC),
          pressaoBar: Number(pressaoBar),
          vibracaoMmS: Number(vibracaoMmS),
          consumoKwh: Number(consumoKwh),
          tempoValvula: Number(tempoValvula),
          ciclo: { idCiclo: Number(idCiclo) },
        },
        { headers: headersAuth }
      );

      setTemperaturaC('');
      setPressaoBar('');
      setVibracaoMmS('');
      setConsumoKwh('');
      setTempoValvula('');
      setPaginaAtual(1);
      carregarDados();
      alertaSucesso('Medição registrada!');
    } catch (erro) {
      alertaErro(erro.response?.data || 'Sem permissão para cadastrar medição.');
    }
  }

  async function handleExcluir(id) {
    if (await confirmarExclusao()) {
      try {
        await api.delete(`/medicoes/${id}`, { headers: headersAuth });
        carregarDados();
        alertaSucesso('Medição excluída!');
      } catch (erro) {
        alertaErro(erro.response?.data || 'Sem permissão para excluir medição.');
      }
    }
  }

  const indiceUltimo = paginaAtual * itensPorPagina;
  const indicePrimeiro = indiceUltimo - itensPorPagina;
  const medicoesPaginadas = medicoes.slice(indicePrimeiro, indiceUltimo);

  return (
    <div>
      <h2>Medições dos Ciclos</h2>

      {isGerente && (
        <form onSubmit={handleCadastrar} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', margin: '20px 0' }}>
          <select value={idCiclo} onChange={(e) => setIdCiclo(e.target.value)} required>
            <option value="">Selecione o Ciclo...</option>
            {ciclos.slice(-100).reverse().map((c) => (
              <option key={c.idCiclo} value={c.idCiclo}>
                Ciclo #{c.idCiclo} - {c.pneu?.modeloPneu || c.turno}
              </option>
            ))}
          </select>
          <input type="number" step="0.01" placeholder="Temperatura (°C)" value={temperaturaC} onChange={(e) => setTemperaturaC(e.target.value)} required />
          <input type="number" step="0.01" placeholder="Pressão (bar)" value={pressaoBar} onChange={(e) => setPressaoBar(e.target.value)} required />
          <input type="number" step="0.01" placeholder="Vibração (mm/s)" value={vibracaoMmS} onChange={(e) => setVibracaoMmS(e.target.value)} required />
          <input type="number" step="0.01" placeholder="Consumo (kWh)" value={consumoKwh} onChange={(e) => setConsumoKwh(e.target.value)} required />
          <input type="number" step="0.01" placeholder="Tempo Válvula" value={tempoValvula} onChange={(e) => setTempoValvula(e.target.value)} required />
          <button type="submit" style={{ backgroundColor: '#0284c7', color: 'white', border: 'none' }}>
            Registrar Medição
          </button>
        </form>
      )}

      <table>
        <thead>
          <tr>
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
          {medicoesPaginadas.map((m) => (
            <tr key={m.idMedicao}>
              <td>#{m.idMedicao}</td>
              <td>#{m.ciclo?.idCiclo || m.idCiclo}</td>
              <td>{m.temperaturaC}</td>
              <td>{m.pressaoBar}</td>
              <td>{m.vibracaoMmS}</td>
              <td>{m.consumoKwh}</td>
              <td>{m.tempoValvula}</td>
              <td>
                {isGerente ? (
                  <button onClick={() => handleExcluir(m.idMedicao)} style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '5px 10px' }}>
                    Excluir
                  </button>
                ) : (
                  <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Apenas visualização</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Paginacao
        paginaAtual={paginaAtual}
        totalItens={medicoes.length}
        itensPorPagina={itensPorPagina}
        aoMudarPagina={(novaPagina) => setPaginaAtual(novaPagina)}
      />
    </div>
  );
}
