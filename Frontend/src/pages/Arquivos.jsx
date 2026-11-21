import { useState, useEffect } from 'react';
import api from '../services/api';
import { alertaSucesso, alertaErro, confirmarExclusao } from '../utils/alertas';

export function Arquivos() {
  const [arquivos, setArquivos] = useState([]);
  const [arquivoSelecionado, setArquivoSelecionado] = useState(null);
  const [importando, setImportando] = useState(false);

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const isGerente = usuarioLogado?.cargo?.toUpperCase() === 'GERENTE';
  const headersAuth = { 'X-User-Id': usuarioLogado?.idUsuario };

  async function carregarDados() {
    try {
      const resArquivos = await api.get('/arquivos');
      setArquivos(Array.isArray(resArquivos.data) ? resArquivos.data : []);
    } catch (erro) {
      console.error('Erro ao carregar arquivos:', erro);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  async function handleImportarCsv(e) {
    e.preventDefault();
    if (!arquivoSelecionado) {
      alertaErro('Selecione um arquivo .csv primeiro!');
      return;
    }

    const formData = new FormData();
    formData.append('file', arquivoSelecionado);

    setImportando(true);
    try {
      const resposta = await api.post('/arquivos/importar', formData, {
        headers: {
          ...headersAuth,
          'Content-Type': 'multipart/form-data',
        },
      });
      setArquivoSelecionado(null);
      e.target.reset();
      carregarDados();
      alertaSucesso(resposta.data || 'CSV importado com sucesso!');
    } catch (erro) {
      alertaErro(erro.response?.data || 'Erro ao importar arquivo CSV.');
    } finally {
      setImportando(false);
    }
  }

  async function handleExcluir(id) {
    if (await confirmarExclusao()) {
      try {
        await api.delete(`/arquivos/${id}`, { headers: headersAuth });
        carregarDados();
        alertaSucesso('Arquivo excluído!');
      } catch (erro) {
        alertaErro(erro.response?.data || 'Erro ao excluir arquivo.');
      }
    }
  }

  return (
    <div>
      <h2>Gerenciamento de Arquivos CSV</h2>

      {isGerente && (
        <form onSubmit={handleImportarCsv} style={{ display: 'flex', gap: '12px', alignItems: 'center', margin: '20px 0', flexWrap: 'wrap' }}>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setArquivoSelecionado(e.target.files[0])}
            required
          />

          <button
            type="submit"
            disabled={importando}
            style={{ backgroundColor: '#0284c7', color: 'white', border: 'none' }}
          >
            {importando ? 'Processando CSV (aguarde)...' : 'Importar CSV para o Banco'}
          </button>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome do Arquivo</th>
            <th>Importado por</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {arquivos.map((arq) => (
            <tr key={arq.idArquivo}>
              <td>#{arq.idArquivo}</td>
              <td>{arq.nomeArquivo}</td>
              <td>{arq.usuario?.nomeUsuario || '-'}</td>
              <td>
                {isGerente ? (
                  <button
                    onClick={() => handleExcluir(arq.idArquivo)}
                    style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '6px 14px' }}
                  >
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
    </div>
  );
}
