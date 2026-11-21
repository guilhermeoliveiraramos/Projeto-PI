import { useState, useEffect } from 'react';
import api from '../services/api';
import { alertaSucesso, alertaErro, confirmarExclusao } from '../utils/alertas';
import { Paginacao } from '../components/Paginacao';

export function Ciclos() {
  const [ciclos, setCiclos] = useState([]);
  const [pneus, setPneus] = useState([]);
  const [arquivos, setArquivos] = useState([]);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 50;

  const [dataHora, setDataHora] = useState('');
  const [turno, setTurno] = useState('Manhã');
  const [statusCiclo, setStatusCiclo] = useState('Concluído');
  const [tempoCicloMin, setTempoCicloMin] = useState('');
  const [curaPct, setCuraPct] = useState('');
  const [eficienciaPct, setEficienciaPct] = useState('');
  const [idPneu, setIdPneu] = useState('');
  const [idArquivo, setIdArquivo] = useState('');

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const cargo = usuarioLogado?.cargo?.toUpperCase() || 'OPERADOR';
  const isGerente = cargo === 'GERENTE';
  const podeCadastrar = cargo === 'GERENTE' || cargo === 'ENGENHEIRO';
  const headersAuth = { 'X-User-Id': usuarioLogado?.idUsuario };

  async function carregarDados() {
    try {
      const [resCiclos, resPneus, resArquivos] = await Promise.all([
        api.get('/ciclos'),
        api.get('/pneus'),
        api.get('/arquivos'),
      ]);
      const lista = Array.isArray(resCiclos.data) ? [...resCiclos.data].reverse() : [];
      setCiclos(lista);
      setPneus(Array.isArray(resPneus.data) ? resPneus.data : []);
      setArquivos(Array.isArray(resArquivos.data) ? resArquivos.data : []);
    } catch (erro) {
      console.error('Erro ao carregar ciclos:', erro);
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

      await api.post('/ciclos', payload, { headers: headersAuth });
      setPaginaAtual(1);
      carregarDados();
      alertaSucesso('Ciclo registrado!');
    } catch (erro) {
      alertaErro(erro.response?.data || 'Erro ao cadastrar ciclo.');
    }
  }

  async function handleExcluir(id) {
    if (await confirmarExclusao()) {
      try {
        await api.delete(`/ciclos/${id}`, { headers: headersAuth });
        carregarDados();
        alertaSucesso('Ciclo excluído!');
      } catch (erro) {
        alertaErro(erro.response?.data || 'Erro ao excluir ciclo.');
      }
    }
  }

  const indiceUltimo = paginaAtual * itensPorPagina;
  const indicePrimeiro = indiceUltimo - itensPorPagina;
  const ciclosPaginados = ciclos.slice(indicePrimeiro, indiceUltimo);

  return (
    <div>
      <h2>Gerenciamento de Ciclos</h2>

      {podeCadastrar && (
        <form onSubmit={handleCadastrar} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', margin: '20px 0' }}>
          <input type="datetime-local" value={dataHora} onChange={(e) => setDataHora(e.target.value)} required />
          <select value={turno} onChange={(e) => setTurno(e.target.value)}>
            <option value="Manhã">Turno: Manhã</option>
            <option value="Tarde">Turno: Tarde</option>
            <option value="Noite">Turno: Noite</option>
          </select>
          <input type="text" placeholder="Status" value={statusCiclo} onChange={(e) => setStatusCiclo(e.target.value)} required />
          <input type="number" step="0.01" placeholder="Tempo (min)" value={tempoCicloMin} onChange={(e) => setTempoCicloMin(e.target.value)} />
          <input type="number" step="0.01" placeholder="Cura (%)" value={curaPct} onChange={(e) => setCuraPct(e.target.value)} />
          <input type="number" step="0.01" placeholder="Eficiência (%)" value={eficienciaPct} onChange={(e) => setEficienciaPct(e.target.value)} />
          <select value={idPneu} onChange={(e) => setIdPneu(e.target.value)} required>
            <option value="">Selecione o Pneu...</option>
            {pneus.map((p) => (
              <option key={p.idPneu} value={p.idPneu}>{p.modeloPneu}</option>
            ))}
          </select>
          <select value={idArquivo} onChange={(e) => setIdArquivo(e.target.value)}>
            <option value="">Arquivo (Opcional)...</option>
            {arquivos.map((a) => (
              <option key={a.idArquivo} value={a.idArquivo}>{a.nomeArquivo}</option>
            ))}
          </select>
          <button type="submit" style={{ backgroundColor: '#0284c7', color: 'white', border: 'none' }}>
            Registrar Ciclo
          </button>
        </form>
      )}

      <table>
        <thead>
          <tr>
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
          {ciclosPaginados.map((c) => (
            <tr key={c.idCiclo}>
              <td>#{c.idCiclo}</td>
              <td>{c.pneu?.modeloPneu || c.idPneu}</td>
              <td>{c.dataHora}</td>
              <td>{c.turno}</td>
              <td>{c.statusCiclo}</td>
              <td>{c.tempoCicloMin}</td>
              <td>{c.curaPct}%</td>
              <td>{c.eficienciaPct}%</td>
              <td>
                {isGerente ? (
                  <button onClick={() => handleExcluir(c.idCiclo)} style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '5px 10px' }}>
                    Excluir
                  </button>
                ) : (
                  <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Sem permissão</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Paginacao
        paginaAtual={paginaAtual}
        totalItens={ciclos.length}
        itensPorPagina={itensPorPagina}
        aoMudarPagina={(novaPagina) => setPaginaAtual(novaPagina)}
      />
    </div>
  );
}
