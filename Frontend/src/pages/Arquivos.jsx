import { useState, useEffect } from 'react';
import api from '../services/api';
import { alertaSucesso, alertaErro, confirmarExclusao } from '../utils/alertas';

export function Arquivos() {
  const [arquivos, setArquivos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [nomeArquivo, setNomeArquivo] = useState('');
  const [idUsuario, setIdUsuario] = useState('');

  async function carregarDados() {
    try {
      const [resArquivos, resUsuarios] = await Promise.all([
        api.get('/arquivos'),
        api.get('/usuarios'),
      ]);
      setArquivos(resArquivos.data);
      setUsuarios(resUsuarios.data);
    } catch (erro) {
      console.error('Erro ao carregar dados:', erro);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  async function handleCadastrar(e) {
    e.preventDefault();
    try {
      await api.post('/arquivos', {
        nomeArquivo,
        usuario: { idUsuario: Number(idUsuario) },
      });
      setNomeArquivo('');
      setIdUsuario('');
      carregarDados();
      alertaSucesso('Arquivo salvo!');
    } catch (erro) {
      alertaErro('Erro ao salvar arquivo. Verifique os campos e o backend.');
    }
  }

  async function handleExcluir(id) {
    if (await confirmarExclusao()) {
      try {
        await api.delete(`/arquivos/${id}`);
        carregarDados();
        alertaSucesso('Arquivo excluído!');
      } catch (erro) {
        alertaErro('Erro ao excluir arquivo.');
      }
    }
  }

  return (
    <div>
      <h2>Gerenciamento de Arquivos</h2>

      <form onSubmit={handleCadastrar} style={{ display: 'flex', gap: '10px', margin: '20px 0', flexWrap: 'wrap' }}>
        <input type="text" placeholder="Nome do arquivo (ex: relatorio_lote1.csv)" value={nomeArquivo} onChange={(e) => setNomeArquivo(e.target.value)} required style={{ padding: '8px', width: '280px' }} />

        <select value={idUsuario} onChange={(e) => setIdUsuario(e.target.value)} required style={{ padding: '8px' }}>
          <option value="">Selecione o Usuário...</option>
          {usuarios.map((u) => (
            <option key={u.idUsuario} value={u.idUsuario}>
              {u.nomeUsuario} ({u.cargo})
            </option>
          ))}
        </select>

        <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#0284c7', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
          Salvar Arquivo
        </button>
      </form>

      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
        <thead>
          <tr style={{ backgroundColor: '#e2e8f0' }}>
            <th>ID</th>
            <th>Nome do Arquivo</th>
            <th>Usuário Responsável</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {arquivos.map((arq) => (
            <tr key={arq.idArquivo}>
              <td>{arq.idArquivo}</td>
              <td>{arq.nomeArquivo}</td>
              <td>{arq.usuario?.nomeUsuario || arq.idUsuario}</td>
              <td>
                <button onClick={() => handleExcluir(arq.idArquivo)} style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}>
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
