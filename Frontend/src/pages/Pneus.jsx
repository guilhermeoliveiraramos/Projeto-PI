import { useState, useEffect } from 'react';
import api from '../services/api';
import { alertaSucesso, alertaErro, confirmarExclusao } from '../utils/alertas';

export function Pneus() {
  const [pneus, setPneus] = useState([]);
  const [modeloPneu, setModeloPneu] = useState('');
  const [quantidade, setQuantidade] = useState('');

  async function carregarPneus() {
    try {
      const resposta = await api.get('/pneus');
      setPneus(resposta.data);
    } catch (erro) {
      console.error('Erro ao buscar pneus:', erro);
    }
  }

  useEffect(() => {
    carregarPneus();
  }, []);

  async function handleCadastrar(evento) {
    evento.preventDefault();
    try {
      await api.post('/pneus', {
        modeloPneu,
        quantidade: Number(quantidade),
      });
      setModeloPneu('');
      setQuantidade('');
      carregarPneus();
      alertaSucesso('Pneu cadastrado!');
    } catch (erro) {
      alertaErro('Não foi possível cadastrar o pneu.');
    }
  }

  async function handleExcluir(id) {
    if (await confirmarExclusao()) {
      try {
        await api.delete(`/pneus/${id}`);
        carregarPneus();
        alertaSucesso('Pneu excluído!');
      } catch (erro) {
        alertaErro('Este pneu está vinculado a um ciclo e não pode ser excluído.');
      }
    }
  }

  const totalPneusEstoque = pneus.reduce((soma, pneu) => soma + (pneu.quantidade || 0), 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Gerenciamento de Pneus</h2>
        <div style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '10px 16px', borderRadius: '6px', fontWeight: 'bold' }}>
          Modelos: {pneus.length} | Total de Pneus: {totalPneusEstoque}
        </div>
      </div>

      <form onSubmit={handleCadastrar} style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
        <input type="text" placeholder="Modelo do pneu (ex: Pirelli Scorpion)" value={modeloPneu} onChange={(e) => setModeloPneu(e.target.value)} required style={{ padding: '8px', width: '320px' }} />
        <input type="number" min="1" placeholder="Quantidade" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} required style={{ padding: '8px', width: '130px' }} />
        <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#0284c7', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
          Cadastrar Pneu
        </button>
      </form>

      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
        <thead>
          <tr style={{ backgroundColor: '#e2e8f0' }}>
            <th style={{ width: '80px' }}>ID</th>
            <th>Modelo do Pneu</th>
            <th style={{ width: '140px' }}>Quantidade</th>
            <th style={{ width: '120px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pneus.map((pneu) => (
            <tr key={pneu.idPneu}>
              <td>{pneu.idPneu}</td>
              <td>{pneu.modeloPneu}</td>
              <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{pneu.quantidade}</td>
              <td style={{ textAlign: 'center' }}>
                <button onClick={() => handleExcluir(pneu.idPneu)} style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}>
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
