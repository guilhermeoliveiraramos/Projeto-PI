import { useState, useEffect } from 'react';
import api from '../services/api';
import { alertaSucesso, alertaErro, confirmarExclusao } from '../utils/alertas';

export function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [cargo, setCargo] = useState('OPERADOR');
  const [dataNascimento, setDataNascimento] = useState('');
  const [sexo, setSexo] = useState('HOMEM');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const isGerente = usuarioLogado?.cargo?.toUpperCase() === 'GERENTE';
  const headersAuth = { 'X-User-Id': usuarioLogado?.idUsuario };

  async function carregarUsuarios() {
    try {
      const resposta = await api.get('/usuarios', { headers: headersAuth });
      setUsuarios(Array.isArray(resposta.data) ? resposta.data : []);
    } catch (erro) {
      console.error('Erro ao buscar usuários:', erro);
    }
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function handleCadastrar(evento) {
    evento.preventDefault();

    // Calcula idade antes de enviar (entre 18 e 100 anos)
    const hoje = new Date();
    const [ano, mes, dia] = dataNascimento.split('-').map(Number);
    let idade = hoje.getFullYear() - ano;
    if (hoje.getMonth() + 1 - mes < 0 || (hoje.getMonth() + 1 - mes === 0 && hoje.getDate() < dia)) {
      idade--;
    }

    if (idade < 18 || idade > 100) {
      alertaErro('A idade do usuário deve estar entre 18 e 100 anos!');
      return;
    }

    try {
      await api.post(
        '/usuarios',
        { nomeUsuario, cargo, dataNascimento, sexo, email, senha },
        { headers: headersAuth }
      );
      setNomeUsuario('');
      setCargo('OPERADOR');
      setDataNascimento('');
      setSexo('HOMEM');
      setEmail('');
      setSenha('');
      carregarUsuarios();
      alertaSucesso('Usuário cadastrado!');
    } catch (erro) {
      const msg = typeof erro.response?.data === 'string'
        ? erro.response.data
        : 'Erro ao cadastrar usuário. Verifique se o e-mail já está em uso.';
      alertaErro(msg);
    }
  }

  async function handleAtribuirGerente(id) {
    try {
      await api.patch(
        `/usuarios/${id}/atribuir-gerente`,
        {},
        { headers: headersAuth }
      );
      carregarUsuarios();
      alertaSucesso('Cargo de Gerente atribuído!');
    } catch (erro) {
      alertaErro(erro.response?.data || 'Sem permissão para atribuir cargo.');
    }
  }

  async function handleExcluir(id) {
    if (await confirmarExclusao()) {
      try {
        await api.delete(`/usuarios/${id}`, { headers: headersAuth });
        carregarUsuarios();
        alertaSucesso('Usuário excluído!');
      } catch (erro) {
        alertaErro(erro.response?.data || 'Não foi possível excluir o usuário.');
      }
    }
  }

  return (
    <div>
      <h2>Gerenciamento de Usuários</h2>

      {isGerente && (
        <form onSubmit={handleCadastrar} style={{ display: 'flex', gap: '10px', margin: '20px 0', flexWrap: 'wrap' }}>
          <input type="text" placeholder="Nome do usuário" value={nomeUsuario} onChange={(e) => setNomeUsuario(e.target.value)} required />
          <input type="date" title="Data de Nascimento (18 a 100 anos)" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} required />

          <select value={sexo} onChange={(e) => setSexo(e.target.value)} required>
            <option value="HOMEM">Homem</option>
            <option value="MULHER">Mulher</option>
            <option value="TRANS">Trans</option>
          </select>

          <select value={cargo} onChange={(e) => setCargo(e.target.value)}>
            <option value="OPERADOR">Operador</option>
            <option value="ENGENHEIRO">Engenheiro</option>
            <option value="GERENTE">Gerente</option>
          </select>

          <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />

          <button type="submit" style={{ backgroundColor: '#0284c7', color: 'white', border: 'none' }}>
            Cadastrar
          </button>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Cargo</th>
            {isGerente && (
              <>
                <th>E-mail</th>
                <th>Nascimento</th>
                <th>Sexo</th>
                <th>Ações</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => (
            <tr key={user.idUsuario}>
              <td>{user.idUsuario}</td>
              <td>{user.nomeUsuario}</td>
              <td>{user.cargo}</td>

              {isGerente && (
                <>
                  <td>{user.email || '-'}</td>
                  <td>{user.dataNascimento || '-'}</td>
                  <td>{user.sexo || '-'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {user.cargo?.toUpperCase() !== 'GERENTE' && (
                        <button
                          onClick={() => handleAtribuirGerente(user.idUsuario)}
                          style={{ backgroundColor: '#0284c7', color: 'white', border: 'none', padding: '6px 12px' }}
                        >
                          Tornar Gerente
                        </button>
                      )}
                      {user.idUsuario !== usuarioLogado?.idUsuario && (
                        <button
                          onClick={() => handleExcluir(user.idUsuario)}
                          style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '6px 12px' }}
                        >
                          Excluir
                        </button>
                      )}
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
